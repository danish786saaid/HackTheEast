"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function OnboardingPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/onboarding/register");
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0c0a09]">
      <div className="h-8 w-8 animate-pulse rounded-lg bg-white/10" />
    </div>
  );
}
