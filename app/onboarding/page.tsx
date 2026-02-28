"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

export default function OnboardingPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated && user) {
      router.replace("/dashboard");
    } else {
      router.replace("/onboarding/register");
    }
  }, [isAuthenticated, user, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0c0a09]">
      <div className="h-8 w-8 animate-pulse rounded-lg bg-white/10" />
    </div>
  );
}
