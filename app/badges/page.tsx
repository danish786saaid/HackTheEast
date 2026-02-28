"use client";

import TopBar from "@/components/layout/TopBar";
import { MOCK_BADGES } from "@/lib/constants";
import type { BadgeStepStatus } from "@/lib/constants";
import {
  Brain,
  Check,
  Coins,
  Globe,
  GraduationCap,
  Layers,
  Shield,
  Wallet,
} from "lucide-react";

const ICON_MAP = {
  Brain,
  Coins,
  Globe,
  GraduationCap,
  Wallet,
  Shield,
  Layers,
} as const;

type IconName = keyof typeof ICON_MAP;

function StepDot({
  label,
  status,
}: {
  label: string;
  status: BadgeStepStatus;
}) {
  const isCompleted = status === "completed";
  const isActive = status === "active";

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-sm px-1.5 py-0.5 text-[10px] font-medium ${
        isCompleted
          ? "bg-emerald-500/15 text-emerald-400"
          : isActive
            ? "bg-[#3b82f6]/20 text-[#60a5fa]"
            : "bg-white/[0.06] text-[#78716c]"
      }`}
    >
      {isCompleted && <Check className="h-2.5 w-2.5" />}
      {isActive && (
        <span className="h-1 w-1 animate-pulse rounded-sm bg-[#60a5fa]" />
      )}
      {label}
    </span>
  );
}

function BadgeCard({
  badge,
}: {
  badge: (typeof MOCK_BADGES)[number];
}) {
  const IconComponent = ICON_MAP[badge.icon as IconName] ?? Brain;
  const achieved = badge.achieved;
  const inProgress = badge.steps.some((s) => s.status === "active");
  const completedCount = badge.steps.filter(
    (s) => s.status === "completed"
  ).length;

  const ringClass = achieved
    ? "ring-1 ring-[#ea580c]/50"
    : inProgress
      ? "ring-1 ring-[#3b82f6]/40"
      : "ring-1 ring-white/[0.08]";

  const iconWrapperClass = achieved
    ? "bg-gradient-to-br from-[#ea580c]/20 to-[#f97316]/10"
    : inProgress
      ? "bg-[#3b82f6]/10"
      : "bg-white/[0.04]";

  return (
    <article
      className={`flex flex-col items-center rounded-none border border-white/[0.07] bg-white/[0.03] p-4 text-center backdrop-blur-sm transition-all duration-200 hover:border-white/[0.12] hover:translate-y-[-1px] ${
        achieved ? "hover:shadow-[0_0_24px_rgba(234,88,12,0.06)]" : ""
      }`}
    >
      {achieved && (
        <span className="mb-2 inline-flex items-center gap-1 rounded-sm bg-[#ea580c]/20 px-2 py-0.5 text-[10px] font-medium text-[#f97316]">
          <Check className="h-2.5 w-2.5" /> Achieved
        </span>
      )}

      <div
        className={`relative flex h-14 w-14 shrink-0 items-center justify-center rounded-sm ${ringClass} ${iconWrapperClass} ${
          !achieved && !inProgress ? "opacity-60" : ""
        }`}
      >
        {achieved && (
          <div
            className="absolute inset-0 rounded-sm opacity-50"
            style={{
              background:
                "radial-gradient(circle, rgba(234,88,12,0.2) 0%, transparent 70%)",
            }}
          />
        )}
        <IconComponent
          className={`relative z-10 h-6 w-6 ${
            achieved
              ? "text-[#f97316]"
              : inProgress
                ? "text-[#60a5fa]"
                : "text-[#78716c]"
          }`}
        />
      </div>

      <h3 className="mt-3 text-sm font-semibold tracking-tight text-[#fafaf9]">
        {badge.title}
      </h3>
      <p className="mt-1 line-clamp-2 text-[11px] leading-snug text-[#a8a29e]">
        {badge.description}
      </p>

      <div className="mt-3 flex flex-wrap items-center justify-center gap-1">
        {badge.steps.map((step) => (
          <StepDot key={step.label} label={step.label} status={step.status} />
        ))}
      </div>

      {inProgress && (
        <p className="mt-1.5 text-[10px] text-[#78716c]">
          {completedCount}/3 steps
        </p>
      )}
    </article>
  );
}

export default function BadgesPage() {
  const masteryBadges = MOCK_BADGES.filter((b) => b.type === "mastery");
  const tutorialBadges = MOCK_BADGES.filter((b) => b.type === "tutorial");
  const earnedCount = MOCK_BADGES.filter((b) => b.achieved).length;
  const totalCount = MOCK_BADGES.length;

  return (
    <>
      <TopBar />
      <main className="mx-auto max-w-[1100px] px-4 py-6 sm:px-6">
        <header className="mb-6">
          <h1 className="text-xl font-semibold tracking-tight text-white">
            Badges
          </h1>
          <p className="mt-0.5 text-[11px] text-[#78716c]">
            Learn → Practice → Master. {earnedCount} of {totalCount} earned.
          </p>
        </header>

        <section className="mb-8">
          <h2 className="mb-3 text-[10px] font-medium uppercase tracking-wider text-[#78716c]">
            Category Mastery
          </h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {masteryBadges.map((badge) => (
              <BadgeCard key={badge.id} badge={badge} />
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-3 text-[10px] font-medium uppercase tracking-wider text-[#78716c]">
            Tutorial Completion
          </h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {tutorialBadges.map((badge) => (
              <BadgeCard key={badge.id} badge={badge} />
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
