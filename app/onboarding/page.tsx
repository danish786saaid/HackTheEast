"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import OnboardingFlow from "@/components/onboarding/OnboardingFlow";
import { useAuth } from "@/lib/auth-context";

export default function OnboardingPage() {
  const router = useRouter();
  const { user, onboardingComplete } = useAuth();

  // Signed-in users who already completed onboarding go straight to dashboard
  useEffect(() => {
    if (user && onboardingComplete) {
      router.replace("/dashboard");
    }
  }, [user, onboardingComplete, router]);

  if (user && onboardingComplete) {
    return null;
  }

  return <OnboardingFlow redirectOnComplete="/dashboard" />;
}
