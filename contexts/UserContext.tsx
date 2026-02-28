"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/lib/supabaseClient";

export type User = { id: string; name: string | null; email: string | null } | null;

const UserContext = createContext<User>(null);

const STORAGE_KEY = "edtech_user_id";

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(null);

  useEffect(() => {
    const client = supabase;
    if (!client) {
      setUser(null);
      return;
    }
    async function loadUser(db: NonNullable<typeof supabase>) {
      const storedId = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
      if (storedId) {
        const { data } = await db.from("users").select("id, name, email").eq("id", storedId).maybeSingle();
        if (data) {
          setUser({ id: data.id, name: data.name, email: data.email });
          return;
        }
      }
      const { data } = await db
        .from("users")
        .select("id, name, email")
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (data) {
        setUser({ id: data.id, name: data.name, email: data.email });
        if (typeof window !== "undefined") localStorage.setItem(STORAGE_KEY, data.id);
      } else setUser(null);
    }
    loadUser(client);
    if (typeof window === "undefined") return;
    const onUserChange = () => loadUser(client);
    window.addEventListener(USER_CHANGE_EVENT, onUserChange);
    return () => window.removeEventListener(USER_CHANGE_EVENT, onUserChange);
  }, []);

  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
}

export function useUser() {
  return useContext(UserContext);
}

export const USER_CHANGE_EVENT = "edtech_user_change";

export function setCurrentUserId(id: string) {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, id);
    window.dispatchEvent(new CustomEvent(USER_CHANGE_EVENT, { detail: id }));
  }
}
