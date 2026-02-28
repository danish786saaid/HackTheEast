"use client";

import { GraduationCap, Presentation, Building2, ArrowLeft, ArrowRight } from "lucide-react";
import SquaredCard from "../SquaredCard";

export type ProfileType = "learner" | "educator" | "institution";

const PROFILES: { id: ProfileType; label: string; description: string; icon: typeof GraduationCap }[] = [
  {
    id: "learner",
    label: "Learner",
    description: "I want to stay ahead and upskill in emerging fields with AI-curated content.",
    icon: GraduationCap,
  },
  {
    id: "educator",
    label: "Educator",
    description: "I create courses or teach — I need fresh, relevant material surfaced automatically.",
    icon: Presentation,
  },
  {
    id: "institution",
    label: "Institution / Team",
    description: "We need a shared knowledge base with adaptive paths for our team members.",
    icon: Building2,
  },
];

type Props = {
  value: ProfileType | null;
  onChange: (v: ProfileType) => void;
  onNext: () => void;
  onBack: () => void;
};

export default function ProfileStep({ value, onChange, onNext, onBack }: Props) {
  return (
    <div className="flex flex-col">
      <h2 className="text-3xl font-semibold tracking-tight text-white">
        How are you using BadgeForge?
      </h2>
      <p className="mt-3 text-base text-white/40">
        This helps us tailor your experience from the start.
      </p>

      <div className="mt-10 grid grid-cols-3 gap-4">
        {PROFILES.map((p) => {
          const Icon = p.icon;
          return (
            <SquaredCard
              key={p.id}
              selected={value === p.id}
              onClick={() => onChange(p.id)}
              className="p-6"
            >
              <Icon className={`h-6 w-6 ${value === p.id ? "text-[#2b6cb0]" : "text-white/30"} transition-colors`} />
              <h3 className="mt-4 text-lg font-medium text-white">{p.label}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/40">
                {p.description}
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
