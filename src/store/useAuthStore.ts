import { create } from 'zustand';
import { User, UserRole } from '@/types';

interface AuthState {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
  setRole: (role: UserRole) => void;
}

const MOCK_USERS: Record<UserRole, User> = {
  SITE_ENGINEER: {
    id: 'eng-1',
    name: 'Amit Sharma',
    email: 'amit.sharma@projectpulse.ai',
    role: 'SITE_ENGINEER',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Amit',
  },
  CONTRACTOR: {
    id: 'con-1',
    name: 'BuildRight Infra Ltd',
    email: 'contact@buildright.com',
    role: 'CONTRACTOR',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=BuildRight',
  },
  GOV_OFFICIAL: {
    id: 'gov-1',
    name: 'Rajesh Kumar',
    email: 'r.kumar@nhai.gov.in',
    role: 'GOV_OFFICIAL',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rajesh',
  },
  CITIZEN: {
    id: 'cit-1',
    name: 'Suresh Iyer',
    email: 'suresh.iyer@gmail.com',
    role: 'CITIZEN',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Suresh',
  },
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  logout: () => set({ user: null }),
  setRole: (role) => set({ user: MOCK_USERS[role] }),
}));

export { MOCK_USERS };
