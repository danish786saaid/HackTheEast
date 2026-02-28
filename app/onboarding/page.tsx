"use client";

import { useState, useCallback, useEffect } from "react";
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
  const {
    user,
    onboardingComplete,
    isAuthenticated,
    completeOnboarding,
    saveOnboardingPrefs,
  } = useAuth();

  const [step, setStep] = useState(0);

  // Signed-in users who already completed onboarding go straight to dashboard
  useEffect(() => {
    if (user && onboardingComplete) {
      router.replace("/");
    }
  }, [user, onboardingComplete, router]);
  const [profileType, setProfileType] = useState<ProfileType | null>(null);
  const [interests, setInterests] = useState<string[]>([]);
  const [experienceLevel, setExperienceLevel] = useState<ExperienceLevel | null>(null);

  const next = useCallback(() => setStep((s) => Math.min(s + 1, TOTAL_STEPS - 1)), []);
  const back = useCallback(() => setStep((s) => Math.max(s - 1, 0)), []);

  const handleComplete = useCallback(async () => {
    await saveOnboardingPrefs({ profileType, interests, experienceLevel });
    completeOnboarding();
    router.push("/");
  }, [saveOnboardingPrefs, completeOnboarding, router, profileType, interests, experienceLevel]);

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
          <>
            {isAuthenticated && user && (
              <p className="mb-4 text-sm text-green-400/80">
                Signed in as {user.email}
              </p>
            )}
            <SummaryStep
              profileType={profileType}
              interests={interests}
              experienceLevel={experienceLevel}
              onBack={back}
              onComplete={handleComplete}
            />
          </>
        )}
      </div>
    </OnboardingLayout>
  );
}
