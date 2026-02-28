"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, User, Layers, BarChart3 } from "lucide-react";
import type { ProfileType } from "./ProfileStep";
import type { ExperienceLevel } from "./ExperienceStep";
import { useAuth } from "@/lib/auth-context";

type Props = {
  profileType: ProfileType | null;
  interests: string[];
  experienceLevel: ExperienceLevel | null;
  onBack: () => void;
  onComplete: () => void;
};

const PROFILE_LABELS: Record<string, string> = {
  learner: "Learner",
  educator: "Educator",
  institution: "Institution / Team",
};

const LEVEL_LABELS: Record<string, string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
};

export default function SummaryStep({
  profileType,
  interests,
  experienceLevel,
  onBack,
  onComplete,
}: Props) {
  const { isAuthenticated } = useAuth();

  return (
    <div className="flex flex-col">
      <h2 className="text-3xl font-semibold tracking-tight text-white">
        You&apos;re all set
      </h2>
      <p className="mt-3 text-base text-white/40">
        Here&apos;s a summary of your preferences. You can change these anytime.
      </p>

      {/* Summary cards */}
      <div className="mt-10 grid grid-cols-3 gap-4">
        <div className="border border-white/[0.08] bg-white/[0.02] p-6">
          <User className="h-5 w-5 text-white/30" />
          <p className="mt-3 text-xs uppercase tracking-widest text-white/25">
            Profile
          </p>
          <p className="mt-1 text-base font-medium text-white">
            {profileType ? PROFILE_LABELS[profileType] : "—"}
          </p>
        </div>

        <div className="border border-white/[0.08] bg-white/[0.02] p-6">
          <Layers className="h-5 w-5 text-white/30" />
          <p className="mt-3 text-xs uppercase tracking-widest text-white/25">
            Interests
          </p>
          <p className="mt-1 text-base font-medium text-white">
            {interests.length} topic{interests.length !== 1 ? "s" : ""}
          </p>
          <p className="mt-1 text-xs text-white/30 line-clamp-2">
            {interests.join(", ")}
          </p>
        </div>

        <div className="border border-white/[0.08] bg-white/[0.02] p-6">
          <BarChart3 className="h-5 w-5 text-white/30" />
          <p className="mt-3 text-xs uppercase tracking-widest text-white/25">
            Level
          </p>
          <p className="mt-1 text-base font-medium text-white">
            {experienceLevel ? LEVEL_LABELS[experienceLevel] : "—"}
          </p>
        </div>
      </div>

      {/* Primary CTA */}
      <button
        onClick={onComplete}
        className="group mt-10 inline-flex w-full items-center justify-center gap-3 border border-[#2b6cb0]/40 bg-[#2b6cb0]/10 px-8 py-4 text-sm font-medium tracking-wide text-white transition-all duration-200 hover:bg-[#2b6cb0]/20"
      >
        Continue to your workspace
        <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
      </button>

      {/* Auth section — only show when not signed in */}
      {!isAuthenticated && (
        <div className="mt-8 border-t border-white/[0.06] pt-8">
          <p className="text-center text-xs uppercase tracking-widest text-white/20 mb-4">
            Or sign in to save your progress
          </p>
          <div className="flex gap-3">
            <Link
              href="/onboarding/register"
              className="flex-1 border border-white/[0.08] bg-white/[0.02] py-3 text-center text-sm font-medium text-white/60 transition-all hover:border-white/[0.16] hover:text-white"
            >
              Create account
            </Link>
            <Link
              href="/onboarding/login"
              className="flex-1 border border-white/[0.08] bg-white/[0.02] py-3 text-center text-sm font-medium text-white/60 transition-all hover:border-white/[0.16] hover:text-white"
            >
              Login
            </Link>
          </div>
        </div>
      )}

      <div className="mt-8 flex items-center">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm text-white/30 transition-colors hover:text-white/60"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
      </div>
    </div>
  );
}
