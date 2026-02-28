"use client";

import { ArrowLeft, ArrowRight, Check } from "lucide-react";

const INTEREST_OPTIONS = [
  "DeFi & DEXs",
  "AI & Machine Learning",
  "Blockchain Regulation",
  "Crypto Markets",
  "Web3 Development",
  "AI Ethics & Safety",
  "Layer 2 Solutions",
  "Tokenomics",
  "NFTs & Digital Assets",
  "Privacy & Security",
  "Smart Contracts",
  "DAO Governance",
  "Quantum Computing",
  "Fintech",
  "Data Science",
  "Cybersecurity",
];

type Props = {
  value: string[];
  onChange: (v: string[]) => void;
  onNext: () => void;
  onBack: () => void;
};

export default function InterestsStep({ value, onChange, onNext, onBack }: Props) {
  function toggle(interest: string) {
    if (value.includes(interest)) {
      onChange(value.filter((i) => i !== interest));
    } else {
      onChange([...value, interest]);
    }
  }

  return (
    <div className="flex flex-col">
      <h2 className="text-3xl font-semibold tracking-tight text-white">
        What topics interest you?
      </h2>
      <p className="mt-3 text-base text-white/40">
        Select at least one. We&apos;ll use these to curate your content feed and learning paths.
      </p>

      <div className="mt-10 flex flex-wrap gap-3">
        {INTEREST_OPTIONS.map((interest) => {
          const isSelected = value.includes(interest);
          return (
            <button
              key={interest}
              type="button"
              onClick={() => toggle(interest)}
              className={`
                inline-flex items-center gap-2 border px-4 py-2.5 text-sm font-medium transition-all duration-200
                ${
                  isSelected
                    ? "border-[#2b6cb0]/50 bg-[#2b6cb0]/10 text-white"
                    : "border-white/[0.08] bg-white/[0.02] text-white/50 hover:border-white/[0.16] hover:text-white/70"
                }
              `}
            >
              {isSelected && <Check className="h-3.5 w-3.5 text-[#2b6cb0]" />}
              {interest}
            </button>
          );
        })}
      </div>

      {value.length > 0 && (
        <p className="mt-4 text-xs text-white/25">
          {value.length} selected
        </p>
      )}

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
          disabled={value.length === 0}
          className="inline-flex items-center gap-2 border border-white/[0.12] bg-white/[0.04] px-6 py-3 text-sm font-medium text-white transition-all duration-200 hover:border-[#2b6cb0]/40 hover:bg-white/[0.06] disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:border-white/[0.12] disabled:hover:bg-white/[0.04]"
        >
          Continue
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
