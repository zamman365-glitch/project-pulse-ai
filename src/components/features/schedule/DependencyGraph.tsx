'use client';

import React, { useCallback, useEffect } from 'react';
import ReactFlow, {
  Background,
  BackgroundVariant,
  Controls,
  Node,
  Edge,
  NodeProps,
  Handle,
  Position,
  useNodesState,
  useEdgesState,
  ConnectionMode
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Activity, ActivityDependency } from '@/types';
import { riskEngineService } from '@/services/risk/RiskEngineService';

// Custom Node for Project Activity
const ActivityNode = ({ data }: NodeProps) => {
  const risk = (data.riskLevel as 'CRITICAL' | 'MODERATE' | 'LOW') || 'LOW';
  const riskColor = {
    CRITICAL: 'border-red-500 bg-red-50 text-red-900 dark:bg-red-950/50 dark:text-red-300 ring-2 ring-red-500/30',
    MODERATE: 'border-amber-500 bg-amber-50 text-amber-900 dark:bg-amber-950/50 dark:text-amber-300',
    LOW: 'border-emerald-500 bg-emerald-50 text-emerald-900 dark:bg-emerald-950/50 dark:text-emerald-300',
  }[risk];

  return (
    <div className={`px-4 py-3 shadow-md rounded-xl border-2 ${riskColor} min-w-[170px] backdrop-blur transition-all duration-300`}>
      <Handle type="target" position={Position.Top} className="w-2.5 h-2.5 !bg-zinc-400" />
      <div className="flex items-center justify-between gap-2 mb-1">
        <span className="text-[10px] font-mono font-bold opacity-75">{data.code}</span>
        {data.isCriticalPath && (
          <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-red-100 dark:bg-red-900/60 text-red-700 dark:text-red-300">
            CP
          </span>
        )}
      </div>
      <div className="text-sm font-semibold leading-tight mb-2">{data.name}</div>
      <div className="flex items-center justify-between text-[10px] font-medium border-t border-current/10 pt-1.5">
        <span>Progress: <strong>{data.progress}%</strong></span>
        <span className="font-bold uppercase tracking-wider">{risk}</span>
      </div>
      <Handle type="source" position={Position.Bottom} className="w-2.5 h-2.5 !bg-zinc-400" />
    </div>
  );
};

const nodeTypes = {
  activity: ActivityNode,
};

export default function DependencyGraph({
  activities,
  dependencies
}: {
  activities: Activity[],
  dependencies: ActivityDependency[]
}) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  useEffect(() => {
    const initialNodes: Node[] = activities.map((act, index) => {
      const risk = riskEngineService.calculateRisk(act, {
        id: `chk-${act.id}`,
        activityId: act.id,
        estimatedPercent: act.actualPercentComplete,
        confidenceScore: 1,
        source: 'MANUAL',
        timestamp: new Date(),
      });

      return {
        id: act.id,
        type: 'activity',
        data: {
          name: act.name,
          code: act.code,
          progress: act.actualPercentComplete,
          isCriticalPath: act.isCriticalPath,
          riskLevel: risk.level,
        },
        position: { x: 280 * (index % 3), y: 80 + Math.floor(index / 3) * 160 },
      };
    });

    const initialEdges: Edge[] = dependencies.map(dep => ({
      id: `e-${dep.predecessorId}-${dep.successorId}`,
      source: dep.predecessorId,
      target: dep.successorId,
      animated: false,
      style: { stroke: '#94a3b8', strokeWidth: 2 },
    }));

    setNodes(initialNodes);
    setEdges(initialEdges);
  }, [activities, dependencies, setNodes, setEdges]);

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    const impactedIds = riskEngineService.analyzeDownstreamImpact(node.id, activities, dependencies);

    setNodes((nds) => nds.map(n => {
      if (n.id === node.id) {
        return {
          ...n,
          style: {
            border: '3px solid #ef4444',
            boxShadow: '0 0 20px rgba(239, 68, 68, 0.6)',
            borderRadius: '0.75rem'
          }
        };
      }
      if (impactedIds.includes(n.id)) {
        return {
          ...n,
          style: {
            border: '2px dashed #f97316',
            boxShadow: '0 0 15px rgba(249, 115, 22, 0.4)',
            borderRadius: '0.75rem'
          }
        };
      }
      return { ...n, style: {} };
    }));

    setEdges((eds) => eds.map(e => {
      if (e.source === node.id || impactedIds.includes(e.source)) {
        return { ...e, animated: true, style: { stroke: '#f97316', strokeWidth: 3 } };
      }
      return { ...e, animated: false, style: { stroke: '#94a3b8', strokeWidth: 2 } };
    }));
  }, [activities, dependencies, setNodes, setEdges]);

  return (
    <div className="h-[520px] w-full border rounded-2xl bg-zinc-50/50 dark:bg-zinc-950 overflow-hidden relative shadow-inner">
      <div className="absolute top-4 left-4 z-10 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md px-3 py-1.5 rounded-lg border shadow-sm text-xs flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
        <span className="font-medium">Interactive Graph</span> &bull; Click any activity to trace downstream ripple impacts
      </div>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        nodeTypes={nodeTypes}
        connectionMode={ConnectionMode.Loose}
        fitView
      >
        <Background variant={BackgroundVariant.Dots} gap={16} size={1.5} color="#94a3b8" />
        <Controls className="!bg-white dark:!bg-zinc-900 !border-zinc-200 dark:!border-zinc-800 !rounded-lg" />
      </ReactFlow>
    </div>
  );
}
