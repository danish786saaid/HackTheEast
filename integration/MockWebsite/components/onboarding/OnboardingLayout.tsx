"use client";

import { BookOpen } from "lucide-react";

type Props = {
  children: React.ReactNode;
  step: number;
  totalSteps: number;
};

export default function OnboardingLayout({ children, step, totalSteps }: Props) {
  const progress = ((step + 1) / totalSteps) * 100;
  const showDither = step === 0;

  return (
    <div className="relative flex min-h-screen flex-col bg-[#0c0a09]">
      {/* Dither background — full viewport, behind everything */}
      {showDither && (
        <div className="fixed inset-0 z-0 overflow-hidden">
          <div
            className="absolute inset-0 opacity-60"
            style={{
              backgroundImage: "url('/onboarding/dither-bg.png')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 80% 60% at 50% 25%, rgba(20,52,94,0.18) 0%, rgba(43,108,176,0.05) 40%, transparent 75%)",
            }}
          />
          <div
            className="absolute bottom-0 left-0 right-0 h-[55%]"
            style={{
              background:
                "linear-gradient(to top, #0c0a09 0%, rgba(12,10,9,0.85) 35%, transparent 100%)",
            }}
          />
        </div>
      )}

      {/* Progress bar */}
      <div className="fixed top-0 left-0 right-0 z-50 h-[2px] bg-white/[0.04]">
        <div
          className="h-full bg-[#2b6cb0] transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-10 py-6">
        <div className="flex items-center gap-2.5">
          <div
            className="flex h-8 w-8 items-center justify-center"
            style={{ background: "linear-gradient(135deg, #14345E, #2b6cb0)" }}
          >
            <BookOpen className="h-4 w-4 text-white" />
          </div>
          <span className="text-lg font-semibold tracking-tight text-white">
            BadgeForge
          </span>
        </div>
        <span className="text-xs tracking-widest uppercase text-white/30">
          {step + 1} / {totalSteps}
        </span>
      </header>

      {/* Content */}
      <div className="relative z-10 flex flex-1 items-center justify-center px-10 pb-16">
        <div className="w-full max-w-[960px]">{children}</div>
      </div>
    </div>
  );
}
