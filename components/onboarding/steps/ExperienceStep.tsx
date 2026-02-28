"use client";

import { ArrowLeft, ArrowRight, Sprout, Flame, Zap } from "lucide-react";
import SquaredCard from "../SquaredCard";

export type ExperienceLevel = "beginner" | "intermediate" | "advanced";

const LEVELS: { id: ExperienceLevel; label: string; description: string; icon: typeof Sprout }[] = [
  {
    id: "beginner",
    label: "Beginner",
    description: "New to this space — I want guided, foundational content to build understanding.",
    icon: Sprout,
  },
  {
    id: "intermediate",
    label: "Intermediate",
    description: "I have working knowledge and want deeper dives and curated updates.",
    icon: Flame,
  },
  {
    id: "advanced",
    label: "Advanced",
    description: "I'm experienced — surface cutting-edge research, analysis, and niche topics.",
    icon: Zap,
  },
];

type Props = {
  value: ExperienceLevel | null;
  onChange: (v: ExperienceLevel) => void;
  onNext: () => void;
  onBack: () => void;
};

export default function ExperienceStep({ value, onChange, onNext, onBack }: Props) {
  return (
    <div className="flex flex-col">
      <h2 className="text-3xl font-semibold tracking-tight text-white">
        What&apos;s your experience level?
      </h2>
      <p className="mt-3 text-base text-white/40">
        We&apos;ll adapt the depth and complexity of your learning paths.
      </p>

      <div className="mt-10 grid grid-cols-3 gap-4">
        {LEVELS.map((level) => {
          const Icon = level.icon;
          return (
            <SquaredCard
              key={level.id}
              selected={value === level.id}
              onClick={() => onChange(level.id)}
              className="p-6"
            >
              <Icon className={`h-6 w-6 ${value === level.id ? "text-[#2b6cb0]" : "text-white/30"} transition-colors`} />
              <h3 className="mt-4 text-lg font-medium text-white">{level.label}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/40">
                {level.description}
              </p>
            </SquaredCard>
          );
        })}
      </div>

      <div className="mt-12 flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm text-white/30 transition-colors hover:text-white/60"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
        <button
          onClick={onNext}
          disabled={!value}
          className="inline-flex items-center gap-2 border border-white/[0.12] bg-white/[0.04] px-6 py-3 text-sm font-medium text-white transition-all duration-200 hover:border-[#2b6cb0]/40 hover:bg-white/[0.06] disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:border-white/[0.12] disabled:hover:bg-white/[0.04]"
        >
          Continue
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
