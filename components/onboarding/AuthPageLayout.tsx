"use client";

import { BookOpen } from "lucide-react";
import Link from "next/link";

export type StepConfig = {
  label: string;
};

type Props = {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  steps: StepConfig[];
  activeStep: number; // 1-based index of highlighted step
};

export default function AuthPageLayout({
  children,
  title,
  subtitle,
  steps,
  activeStep,
}: Props) {
  return (
    <div className="relative flex min-h-screen bg-[var(--bg-primary)]">
      {/* Left panel — gradient, steps */}
      <div
        className="flex w-[min(48%,480px)] flex-col justify-between px-12 py-14"
        style={{
          background:
            "linear-gradient(135deg, var(--bg-primary) 0%, var(--bg-secondary) 50%, rgba(41,37,36,0.95) 100%)",
          boxShadow: "inset -1px 0 0 rgba(255,255,255,0.06)",
        }}
      >
        <div>
          <Link
            href="/onboarding"
            className="inline-flex items-center gap-2.5 text-white/80 transition-colors hover:text-white"
          >
            <div
              className="flex h-8 w-8 items-center justify-center rounded-none"
              style={{
                background: "linear-gradient(135deg, var(--accent), var(--accent-amber))",
              }}
            >
              <BookOpen className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-semibold tracking-tight">BadgeForge</span>
          </Link>
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">
            {title}
          </h1>
          <p className="mt-2 text-base text-[var(--text-secondary)]">
            {subtitle}
          </p>
          <div className="mt-10 flex flex-col gap-3">
            {steps.map((step, i) => {
              const isActive = i + 1 === activeStep;
              return (
                <div
                  key={step.label}
                  className={`border px-4 py-3 rounded-none transition-colors ${
                    isActive
                      ? "border-white/20 bg-white text-[var(--bg-primary)]"
                      : "border-white/[0.08] bg-white/[0.02] text-[var(--text-secondary)]"
                  }`}
                >
                  <span
                    className={`mr-2 inline-flex h-6 w-6 items-center justify-center text-xs font-semibold ${
                      isActive ? "bg-[var(--bg-primary)]/15 text-[var(--bg-primary)]" : "bg-white/10 text-white/90"
                    }`}
                  >
                    {i + 1}
                  </span>
                  {step.label}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex flex-1 flex-col bg-[var(--bg-primary)]">
        <div className="flex flex-1 items-center justify-center px-12 py-14">
          <div className="w-full max-w-[400px]">{children}</div>
        </div>
      </div>
    </div>
  );
}
