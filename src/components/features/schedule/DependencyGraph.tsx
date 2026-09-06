'use client';

import React, { useCallback, useEffect } from 'react';
import ReactFlow, {
  Background,
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
  const riskColor = {
    CRITICAL: 'border-red-500 bg-red-50 text-red-900 dark:bg-red-900/20 dark:text-red-400',
    MODERATE: 'border-amber-500 bg-amber-50 text-amber-900 dark:bg-amber-900/20 dark:text-amber-400',
    LOW: 'border-green-500 bg-green-50 text-green-900 dark:bg-green-900/20 dark:text-green-400',
  }[data.riskLevel || 'LOW'];

  return (
    <div className={`px-4 py-2 shadow-sm rounded-md border-2 ${riskColor} min-w-[150px]`}>
      <Handle type="target" position={Position.Top} className="w-2 h-2" />
      <div className="text-xs font-bold opacity-70">{data.code}</div>
      <div className="text-sm font-medium leading-tight">{data.name}</div>
      <div className="text-[10px] mt-1 font-bold uppercase">{data.riskLevel}</div>
      <Handle type="source" position={Position.Bottom} className="w-2 h-2" />
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
          riskLevel: risk.level,
        },
        position: { x: 250 * (index % 3), y: 100 + (index * 120) },
      };
    });

    const initialEdges: Edge[] = dependencies.map(dep => ({
      id: `e-${dep.predecessorId}-${dep.successorId}`,
      source: dep.predecessorId,
      target: dep.successorId,
      animated: false,
    }));

    setNodes(initialNodes);
    setEdges(initialEdges);
  }, [activities, dependencies, setNodes, setEdges]);

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    const impactedIds = riskEngineService.analyzeDownstreamImpact(node.id, activities, dependencies);

    setNodes((nds) => nds.map(n => {
      if (n.id === node.id) {
        return { ...n, style: { border: '3px solid red', boxShadow: '0 0 10px red' } };
      }
      if (impactedIds.includes(n.id)) {
        return { ...n, style: { border: '2px solid orange', boxShadow: '0 0 5px orange' } };
      }
      return { ...n, style: {} };
    }));

    setEdges((eds) => eds.map(e => {
      if (e.source === node.id || impactedIds.includes(e.source)) {
        return { ...e, animated: true, style: { stroke: 'orange' } };
      }
      return { ...e, animated: false, style: {} };
    }));
  }, [activities, dependencies, setNodes, setEdges]);

  return (
    <div className="h-[600px] w-full border rounded-xl bg-white dark:bg-zinc-950 overflow-hidden relative">
      <div className="absolute top-4 left-4 z-10 bg-white/80 dark:bg-zinc-900/80 p-2 rounded border text-xs">
        Click a node to see downstream impact
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
        <Background variant="dots" gap={12} size={1} />
        <Controls />
      </ReactFlow>
    </div>
  );
}
