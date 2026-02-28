"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import TopBar from "@/components/layout/TopBar";
import Dashboard from "@/components/dashboard/Dashboard";
import { useAuth } from "@/lib/auth-context";

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [stuck, setStuck] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || !user) {
      router.replace("/onboarding/register");
      return;
    }
  }, [isAuthenticated, user, router]);

  useEffect(() => {
    const t = setTimeout(() => setStuck(true), 2500);
    return () => clearTimeout(t);
  }, []);
  useEffect(() => {
    if (stuck && !user) {
      router.replace("/onboarding/register");
    }
  }, [stuck, user, router]);

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0c0a09]">
        <div className="h-8 w-8 animate-pulse rounded-lg bg-white/10" />
      </div>
    );
  }

  return (
    <>
      <TopBar />
      <Dashboard />
    </>
  );
}
