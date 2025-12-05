import { create } from "zustand";

interface User {
  username: string;
  name: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

// Mock users
const mockUsers: Record<string, { password: string; name: string }> = {
  admin: { password: "1234", name: "홍길동" },
  assignee: { password: "1124", name: "남궁민" },
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  login: (username: string, password: string) => {
    const mockUser = mockUsers[username];
    if (mockUser && mockUser.password === password) {
      set({
        user: { username, name: mockUser.name },
        isAuthenticated: true,
      });
      return true;
    }
    return false;
  },
  logout: () => {
    set({ user: null, isAuthenticated: false });
  },
}));
