"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { supabase } from "./supabaseClient";

// ── Storage keys ─────────────────────────────────────────
const AUTH_STORAGE_KEY = "edtech-auth";
const GUEST_ONBOARDING_KEY = "edtech-guest-onboarding";

// ── Types ────────────────────────────────────────────────
export type User = {
  id: string;
  name: string;
  email: string;
  handle: string;
};

export type OnboardingPrefs = {
  profileType: string | null;
  interests: string[];
  experienceLevel: string | null;
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
  signInWithOAuth: (provider: "google" | "apple") => Promise<void>;
  signInWithEmail: (email: string) => Promise<void>;
  saveOnboardingPrefs: (prefs: OnboardingPrefs) => Promise<void>;
  getGuestOnboardingPrefs: () => OnboardingPrefs | null;
};

const AuthContext = createContext<AuthContextValue | null>(null);

// ── Local storage helpers ────────────────────────────────

function loadStored(): StoredAuth | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as StoredAuth) : null;
  } catch {
    return null;
  }
}

function saveStored(data: StoredAuth | null) {
  if (typeof window === "undefined") return;
  if (data) localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(data));
  else localStorage.removeItem(AUTH_STORAGE_KEY);
}

// ── Guest onboarding cache ───────────────────────────────

function cacheGuestOnboarding(prefs: OnboardingPrefs) {
  if (typeof window === "undefined") return;
  localStorage.setItem(GUEST_ONBOARDING_KEY, JSON.stringify(prefs));
}

function loadGuestOnboarding(): OnboardingPrefs | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(GUEST_ONBOARDING_KEY);
    return raw ? (JSON.parse(raw) as OnboardingPrefs) : null;
  } catch {
    return null;
  }
}

function clearGuestOnboarding() {
  if (typeof window !== "undefined") localStorage.removeItem(GUEST_ONBOARDING_KEY);
}

// ── Utilities ────────────────────────────────────────────

function slugFromName(name: string): string {
  return name.toLowerCase().replace(/\s+/g, "_").replace(/[^a-z0-9_]/g, "");
}

function mapSupabaseUser(su: {
  id: string;
  email?: string | null;
  user_metadata?: Record<string, unknown>;
}): User {
  const name =
    (su.user_metadata?.full_name as string) ??
    (su.user_metadata?.username as string) ??
    (su.user_metadata?.name as string) ??
    su.email?.split("@")[0] ??
    "User";
  return {
    id: su.id,
    name,
    email: su.email ?? "",
    handle: `@${slugFromName(name)}`,
  };
}

// ── Supabase persistence for onboarding prefs ────────────

async function upsertOnboardingToSupabase(
  userId: string,
  prefs: OnboardingPrefs
) {
  if (!supabase) return;
  const { error } = await supabase.from("user_onboarding").upsert(
    {
      user_id: userId,
      profile_type: prefs.profileType,
      interests: prefs.interests,
      experience_level: prefs.experienceLevel,
    },
    { onConflict: "user_id" }
  );
  if (error) console.error("[auth] Failed to persist onboarding:", error.message);
}

/**
 * Check if the user has a user_onboarding record in Supabase (onboarding complete).
 */
async function hasOnboardingRecord(userId: string): Promise<boolean> {
  if (!supabase) return false;
  const { data, error } = await supabase
    .from("user_onboarding")
    .select("user_id")
    .eq("user_id", userId)
    .maybeSingle();
  return !error && !!data;
}

/**
 * After OAuth redirect, if guest had cached onboarding prefs,
 * persist them to Supabase and clear the cache.
 */
async function migrateGuestPrefsIfNeeded(userId: string) {
  const cached = loadGuestOnboarding();
  if (!cached) return;
  await upsertOnboardingToSupabase(userId, cached);
  clearGuestOnboarding();
}

// ── Provider ─────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [onboardingComplete, setOnboardingComplete] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  const persist = useCallback((u: User | null, complete: boolean) => {
    setUser(u);
    setOnboardingComplete(complete);
    saveStored(u ? { user: u, onboardingComplete: complete } : null);
  }, []);

  // Hydrate: check Supabase session first, then localStorage fallback
  useEffect(() => {
    async function init() {
      if (supabase) {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (session?.user) {
          const mapped = mapSupabaseUser(session.user);
          await migrateGuestPrefsIfNeeded(mapped.id);
          const complete = await hasOnboardingRecord(mapped.id);
          persist(mapped, complete);
          setHydrated(true);
          return;
        }
      }
      const stored = loadStored();
      if (stored?.user) {
        setUser(stored.user);
        setOnboardingComplete(stored.onboardingComplete ?? false);
      }
      setHydrated(true);
    }

    init();

    if (supabase) {
      const {
        data: { subscription },
      } =       supabase.auth.onAuthStateChange(async (_event, session) => {
        if (session?.user) {
          const mapped = mapSupabaseUser(session.user);
          await migrateGuestPrefsIfNeeded(mapped.id);
          const complete = await hasOnboardingRecord(mapped.id);
          persist(mapped, complete);
        } else {
          persist(null, false);
        }
      });
      return () => subscription.unsubscribe();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── OAuth (Google / Apple) ─────────────────────────────
  const signInWithOAuth = useCallback(
    async (provider: "google" | "apple") => {
      if (!supabase) {
        console.warn("[auth] Supabase not configured — OAuth unavailable");
        return;
      }
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/onboarding`,
        },
      });
      if (error) throw new Error(error.message);
    },
    []
  );

  // ── Magic link email auth ──────────────────────────────
  const signInWithEmail = useCallback(async (email: string) => {
    if (!supabase) {
      console.warn("[auth] Supabase not configured — email auth unavailable");
      return;
    }
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/onboarding`,
      },
    });
    if (error) throw new Error(error.message);
  }, []);

  // ── Save onboarding preferences ────────────────────────
  // Authenticated: persists to user_onboarding table
  // Guest: caches in localStorage
  const saveOnboardingPrefs = useCallback(
    async (prefs: OnboardingPrefs) => {
      if (user && supabase) {
        await upsertOnboardingToSupabase(user.id, prefs);
        clearGuestOnboarding();
      } else {
        cacheGuestOnboarding(prefs);
      }
    },
    [user]
  );

  // ── Read guest onboarding cache ────────────────────────
  const getGuestOnboardingPrefs = useCallback(() => {
    return loadGuestOnboarding();
  }, []);

  // ── Password-based login ───────────────────────────────
  const login = useCallback(
    async (email: string, password: string) => {
      if (supabase) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw new Error(error.message);
        return;
      }
      await new Promise((r) => setTimeout(r, 400));
      const name = email.split("@")[0].replace(/[._]/g, " ");
      const displayName = name.charAt(0).toUpperCase() + name.slice(1);
      persist(
        {
          id: `user-${Date.now()}`,
          name: displayName,
          email,
          handle: `@${slugFromName(displayName) || "user"}`,
        },
        true
      );
    },
    [persist]
  );

  // ── Password-based register ────────────────────────────
  const register = useCallback(
    async (name: string, email: string, password: string) => {
      if (supabase) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { username: name, full_name: name } },
        });
        if (error) throw new Error(error.message);
        return;
      }
      await new Promise((r) => setTimeout(r, 400));
      persist(
        {
          id: `user-${Date.now()}`,
          name: name.trim(),
          email,
          handle: `@${slugFromName(name) || "user"}`,
        },
        false
      );
    },
    [persist]
  );

  const logout = useCallback(async () => {
    if (supabase) await supabase.auth.signOut();
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
    signInWithOAuth,
    signInWithEmail,
    saveOnboardingPrefs,
    getGuestOnboardingPrefs,
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

export function initials(name: string): string {
  return name
    .split(/\s+/)
    .map((s) => s[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}
