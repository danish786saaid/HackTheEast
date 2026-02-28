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
    isAuthenticated,
    completeOnboarding,
    signInWithOAuth,
    signInWithEmail,
    saveOnboardingPrefs,
    getGuestOnboardingPrefs,
  } = useAuth();

  const [step, setStep] = useState(0);
  const [profileType, setProfileType] = useState<ProfileType | null>(null);
  const [interests, setInterests] = useState<string[]>([]);
  const [experienceLevel, setExperienceLevel] = useState<ExperienceLevel | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  const [emailSent, setEmailSent] = useState(false);

  // Restore guest onboarding state after OAuth redirect
  useEffect(() => {
    const cached = getGuestOnboardingPrefs();
    if (cached) {
      if (cached.profileType) setProfileType(cached.profileType as ProfileType);
      if (cached.interests?.length) setInterests(cached.interests);
      if (cached.experienceLevel) setExperienceLevel(cached.experienceLevel as ExperienceLevel);
    }
  }, [getGuestOnboardingPrefs]);

  const next = useCallback(() => setStep((s) => Math.min(s + 1, TOTAL_STEPS - 1)), []);
  const back = useCallback(() => setStep((s) => Math.max(s - 1, 0)), []);

  // Cache guest state before any auth redirect so it survives the round-trip
  const cacheCurrentState = useCallback(() => {
    saveOnboardingPrefs({ profileType, interests, experienceLevel });
  }, [saveOnboardingPrefs, profileType, interests, experienceLevel]);

  const handleComplete = useCallback(async () => {
    await saveOnboardingPrefs({ profileType, interests, experienceLevel });
    completeOnboarding();
    router.push("/");
  }, [saveOnboardingPrefs, completeOnboarding, router, profileType, interests, experienceLevel]);

  const handleAuthGoogle = useCallback(async () => {
    try {
      setAuthError(null);
      cacheCurrentState();
      await signInWithOAuth("google");
    } catch (err) {
      setAuthError((err as Error).message);
    }
  }, [signInWithOAuth, cacheCurrentState]);

  const handleAuthApple = useCallback(async () => {
    try {
      setAuthError(null);
      cacheCurrentState();
      await signInWithOAuth("apple");
    } catch (err) {
      setAuthError((err as Error).message);
    }
  }, [signInWithOAuth, cacheCurrentState]);

  const handleAuthEmail = useCallback(async () => {
    try {
      setAuthError(null);
      setEmailSent(false);
      const email = window.prompt("Enter your email address:");
      if (!email) return;
      cacheCurrentState();
      await signInWithEmail(email);
      setEmailSent(true);
    } catch (err) {
      setAuthError((err as Error).message);
    }
  }, [signInWithEmail, cacheCurrentState]);

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
              onAuthGoogle={handleAuthGoogle}
              onAuthApple={handleAuthApple}
              onAuthEmail={handleAuthEmail}
            />
            {emailSent && (
              <p className="mt-4 text-center text-sm text-blue-400">
                Magic link sent! Check your email and click the link to sign in.
              </p>
            )}
            {authError && (
              <p className="mt-4 text-center text-sm text-red-400">
                {authError}
              </p>
            )}
          </>
        )}
      </div>
    </OnboardingLayout>
  );
}
