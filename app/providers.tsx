"use client";

import { AuthProvider } from "@/lib/auth-context";
import { UserProvider } from "@/contexts/UserContext";
import { TutorialProgressProvider } from "@/contexts/TutorialProgressContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <UserProvider>
        <TutorialProgressProvider>{children}</TutorialProgressProvider>
      </UserProvider>
    </AuthProvider>
  );
}
