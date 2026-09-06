import { create } from 'zustand';
import { User, UserRole } from '@/types';

interface AuthState {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
  setRole: (role: UserRole) => void;
  loginByEmail: (email: string) => UserRole;
}

const MOCK_USERS: Record<UserRole, User> = {
  SITE_ENGINEER: {
    id: 'eng-1',
    name: 'Amit Sharma',
    email: 'engineer@projectpulse.gov.in',
    role: 'SITE_ENGINEER',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Amit',
  },
  CONTRACTOR: {
    id: 'con-1',
    name: 'BuildRight Infra Ltd',
    email: 'contractor@projectpulse.gov.in',
    role: 'CONTRACTOR',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=BuildRight',
  },
  GOV_OFFICIAL: {
    id: 'gov-1',
    name: 'Rajesh Kumar',
    email: 'official@projectpulse.gov.in',
    role: 'GOV_OFFICIAL',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rajesh',
  },
  CITIZEN: {
    id: 'cit-1',
    name: 'Suresh Iyer',
    email: 'citizen@projectpulse.gov.in',
    role: 'CITIZEN',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Suresh',
  },
};

const EMAIL_ROLE_MAP: Record<string, UserRole> = {
  'admin@projectpulse.gov.in': 'GOV_OFFICIAL',
  'official@projectpulse.gov.in': 'GOV_OFFICIAL',
  'engineer@projectpulse.gov.in': 'SITE_ENGINEER',
  'contractor@projectpulse.gov.in': 'CONTRACTOR',
  'citizen@projectpulse.gov.in': 'CITIZEN',
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  logout: () => set({ user: null }),
  setRole: (role) => set({ user: MOCK_USERS[role] }),
  loginByEmail: (email) => {
    const normalized = email.toLowerCase().trim();
    let matchedRole: UserRole = 'GOV_OFFICIAL';

    if (normalized.includes('engineer') || normalized.includes('field') || normalized.includes('site')) {
      matchedRole = 'SITE_ENGINEER';
    } else if (normalized.includes('contractor') || normalized.includes('builder') || normalized.includes('vendor')) {
      matchedRole = 'CONTRACTOR';
    } else if (normalized.includes('citizen') || normalized.includes('public')) {
      matchedRole = 'CITIZEN';
    } else if (EMAIL_ROLE_MAP[normalized]) {
      matchedRole = EMAIL_ROLE_MAP[normalized];
    }

    set({ user: MOCK_USERS[matchedRole] });
    return matchedRole;
  },
}));

export { MOCK_USERS };
