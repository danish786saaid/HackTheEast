"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import OnboardingLayout from "@/components/onboarding/OnboardingLayout";
import WelcomeStep from "@/components/onboarding/steps/WelcomeStep";
import ProfileStep, { type ProfileType } from "@/components/onboarding/steps/ProfileStep";
import InterestsStep from "@/components/onboarding/steps/InterestsStep";
import ExperienceStep, { type ExperienceLevel } from "@/components/onboarding/steps/ExperienceStep";
import SummaryStep from "@/components/onboarding/steps/SummaryStep";
import { useAuth } from "@/lib/auth-context";

const TOTAL_STEPS = 5;

export default function OnboardingPage() {
  const router = useRouter();
  const { completeOnboarding } = useAuth();

  const [step, setStep] = useState(0);
  const [profileType, setProfileType] = useState<ProfileType | null>(null);
  const [interests, setInterests] = useState<string[]>([]);
  const [experienceLevel, setExperienceLevel] = useState<ExperienceLevel | null>(null);

  const next = useCallback(() => setStep((s) => Math.min(s + 1, TOTAL_STEPS - 1)), []);
  const back = useCallback(() => setStep((s) => Math.max(s - 1, 0)), []);

  const handleComplete = useCallback(() => {
    completeOnboarding();
    router.push("/");
  }, [completeOnboarding, router]);

  // Placeholder auth handlers — your teammate wires these to Supabase
  const handleAuthGoogle = useCallback(() => {
    console.log("[Supabase] Continue with Google — not wired yet");
  }, []);
  const handleAuthApple = useCallback(() => {
    console.log("[Supabase] Continue with Apple — not wired yet");
  }, []);
  const handleAuthEmail = useCallback(() => {
    console.log("[Supabase] Continue with Email — not wired yet");
  }, []);

  return (
    <OnboardingLayout step={step} totalSteps={TOTAL_STEPS}>
      <div
        key={step}
        className="animate-in fade-in slide-in-from-right-4 duration-300"
        style={{
          animation: "fadeSlideIn 300ms ease-out both",
        }}
      >
        {step === 0 && <WelcomeStep onNext={next} />}
        {step === 1 && (
          <ProfileStep
            value={profileType}
            onChange={setProfileType}
            onNext={next}
            onBack={back}
          />
        )}
        {step === 2 && (
          <InterestsStep
            value={interests}
            onChange={setInterests}
            onNext={next}
            onBack={back}
          />
        )}
        {step === 3 && (
          <ExperienceStep
            value={experienceLevel}
            onChange={setExperienceLevel}
            onNext={next}
            onBack={back}
          />
        )}
        {step === 4 && (
          <SummaryStep
            profileType={profileType}
            interests={interests}
            experienceLevel={experienceLevel}
            onBack={back}
            onComplete={handleComplete}
            onAuthGoogle={handleAuthGoogle}
            onAuthApple={handleAuthApple}
            onAuthEmail={handleAuthEmail}
          />
        )}
      </div>
    </OnboardingLayout>
  );
}
