"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

const STORAGE_KEY = "edtech-auth";

export type User = {
  id: string;
  name: string;
  email: string;
  handle: string;
};

type StoredAuth = {
  user: User;
  onboardingComplete: boolean;
};

type AuthContextValue = {
  user: User | null;
  isAuthenticated: boolean;
  onboardingComplete: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  completeOnboarding: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function loadStored(): StoredAuth | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as StoredAuth;
  } catch {
    return null;
  }
}

function saveStored(data: StoredAuth | null) {
  if (typeof window === "undefined") return;
  if (data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } else {
    localStorage.removeItem(STORAGE_KEY);
  }
}

function initials(name: string): string {
  return name
    .split(/\s+/)
    .map((s) => s[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function slugFromName(name: string): string {
  return name
    .toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/[^a-z0-9_]/g, "");
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [onboardingComplete, setOnboardingComplete] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = loadStored();
    if (stored?.user) {
      setUser(stored.user);
      setOnboardingComplete(stored.onboardingComplete ?? false);
    }
    setHydrated(true);
  }, []);

  const persist = useCallback((u: User | null, complete: boolean) => {
    setUser(u);
    setOnboardingComplete(complete);
    if (u) {
      saveStored({ user: u, onboardingComplete: complete });
    } else {
      saveStored(null);
    }
  }, []);

  const login = useCallback(
    async (email: string, _password: string) => {
      await new Promise((r) => setTimeout(r, 400));
      const name = email.split("@")[0].replace(/[._]/g, " ");
      const displayName = name.charAt(0).toUpperCase() + name.slice(1);
      const handle = slugFromName(displayName) || "user";
      const newUser: User = {
        id: `user-${Date.now()}`,
        name: displayName,
        email,
        handle: `@${handle}`,
      };
      persist(newUser, true);
    },
    [persist]
  );

  const register = useCallback(
    async (name: string, email: string, _password: string) => {
      await new Promise((r) => setTimeout(r, 400));
      const handle = slugFromName(name) || "user";
      const newUser: User = {
        id: `user-${Date.now()}`,
        name: name.trim(),
        email,
        handle: `@${handle}`,
      };
      persist(newUser, false);
    },
    [persist]
  );

  const logout = useCallback(() => {
    persist(null, false);
  }, [persist]);

  const completeOnboarding = useCallback(() => {
    if (!user) return;
    setOnboardingComplete(true);
    saveStored({ user, onboardingComplete: true });
  }, [user]);

  const value: AuthContextValue = {
    user,
    isAuthenticated: !!user,
    onboardingComplete,
    login,
    register,
    logout,
    completeOnboarding,
  };

  if (!hydrated) {
    return (
      <AuthContext.Provider value={value}>
        <div className="min-h-screen flex items-center justify-center bg-[#0c0a09]">
          <div className="h-8 w-8 animate-pulse rounded-lg bg-white/10" />
        </div>
      </AuthContext.Provider>
    );
  }

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export { initials };
