"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import TopBar from "@/components/layout/TopBar";
import BentoMain from "@/components/dashboard/BentoMain";
import { useAuth } from "@/lib/auth-context";

export default function DashboardPage() {
  const router = useRouter();
  const { user, onboardingComplete, isAuthenticated } = useAuth();
  const [stuck, setStuck] = useState(false);

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

  // If still showing loading after 2.5s (e.g. post-OAuth session not synced), redirect to home
  useEffect(() => {
    const t = setTimeout(() => setStuck(true), 2500);
    return () => clearTimeout(t);
  }, []);
  useEffect(() => {
    if (stuck && (!user || !onboardingComplete)) {
      router.replace("/");
    }
  }, [stuck, user, onboardingComplete, router]);

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
