"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import TopBar from "@/components/layout/TopBar";
import BentoMain from "@/components/dashboard/BentoMain";
import { useAuth } from "@/lib/auth-context";

export default function DashboardPage() {
  const router = useRouter();
  const { user, onboardingComplete, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated || !user) {
      router.replace("/");
      return;
    }
    if (!onboardingComplete) {
      router.replace("/");
      return;
    }
  }, [isAuthenticated, user, onboardingComplete, router]);

  if (!isAuthenticated || !user || !onboardingComplete) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0c0a09]">
        <div className="h-8 w-8 animate-pulse rounded-lg bg-white/10" />
      </div>
    );
  }

  return (
    <>
      <TopBar />
      <BentoMain />
    </>
  );
}
