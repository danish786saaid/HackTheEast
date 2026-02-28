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
import { useEffect, useMemo, useState } from "react";

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

function statusLabel(achieved: boolean, inProgress: boolean) {
  if (achieved) return "Achieved";
  if (inProgress) return "In Progress";
  return "Locked";
}

function progressColor(achieved: boolean, inProgress: boolean) {
  if (achieved) return "#22c55e";
  if (inProgress) return "#3b82f6";
  return "#78716c";
}

function StepRow({
  label,
  status,
}: {
  label: string;
  status: BadgeStepStatus;
}) {
  const isCompleted = status === "completed";
  const isActive = status === "active";

  return (
    <div className="flex items-center gap-3 py-1.5">
      <div
        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-none border-2 transition-colors ${
          isCompleted
            ? "border-[#22c55e] bg-[#22c55e]"
            : isActive
              ? "border-[#3b82f6] bg-[#3b82f6]/20"
              : "border-white/[0.2] bg-white/[0.04]"
        }`}
      >
        {isCompleted && (
          <Check className="h-3 w-3 text-white badge-check-in" />
        )}
        {isActive && (
          <span className="h-1.5 w-1.5 animate-pulse rounded-none bg-[#60a5fa]" />
        )}
      </div>
      <span
        className={`text-xs ${
          isCompleted
            ? "text-[#a8a29e] line-through"
            : isActive
              ? "text-[#fafaf9] font-medium"
              : "text-[#78716c]"
        }`}
      >
        {label}
      </span>
    </div>
  );
}

function BadgeCard({
  badge,
  index,
  isExpanded,
  onExpand,
  onCollapse,
}: {
  badge: (typeof MOCK_BADGES)[number];
  index: number;
  isExpanded: boolean;
  onExpand: () => void;
  onCollapse: () => void;
}) {
  const [progressVisible, setProgressVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setProgressVisible(true), 100 + index * 80);
    return () => clearTimeout(t);
  }, [index]);

  const IconComponent = ICON_MAP[badge.icon as IconName] ?? Brain;
  const achieved = badge.achieved;
  const inProgress = badge.steps.some((s) => s.status === "active");
  const completedSteps = badge.steps.filter(
    (s) => s.status === "completed"
  ).length;
  const totalSteps = badge.steps.length;
  const progressPct =
    totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;
  const color = progressColor(achieved, inProgress);

  return (
    <article
      className="badge-card-enter self-start overflow-hidden rounded-none border border-white/[0.08] bg-white/[0.04] p-3 shadow-lg backdrop-blur-md transition-[border-color,box-shadow,transform] duration-500 ease-in-out hover:-translate-y-1 hover:border-white/[0.12] hover:shadow-xl hover:shadow-black/20"
      style={{
        animationDelay: `${index * 0.06}s`,
        animationFillMode: "backwards",
      }}
      onMouseEnter={onExpand}
      onMouseLeave={onCollapse}
    >
      {/* Collapsed: icon + title + hint (always visible) */}
      <div className="flex items-center gap-2.5 min-w-0">
        <div
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-none transition-colors"
          style={{
            background: `${color}20`,
            color,
          }}
        >
          <IconComponent className="h-3.5 w-3.5" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-sm font-semibold tracking-tight text-[#fafaf9]">
            {badge.title}
          </h3>
          <p className="text-[10px] text-[#78716c]">
            {completedSteps} of {totalSteps} · {progressPct}%
          </p>
        </div>
      </div>

      {/* Expanded only when this card is hovered: progress bar, steps, status */}
      <div
        className="block overflow-hidden transition-[max-height] duration-500 ease-in-out"
        style={{ maxHeight: isExpanded ? 280 : 0 }}
      >
        <div className="pt-3">
          {/* Progress bar */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-medium tabular-nums text-[#78716c]">
              {completedSteps} of {totalSteps}
            </span>
            <div className="flex-1 h-1.5 overflow-hidden rounded-none bg-white/[0.08]">
              <div
                className="h-full rounded-none transition-all duration-700 ease-out"
                style={{
                  width: progressVisible ? `${progressPct}%` : "0%",
                  backgroundColor: color,
                }}
              />
            </div>
            <span
              className="text-[10px] font-semibold tabular-nums transition-colors duration-500"
              style={{ color: progressVisible ? color : "#78716c" }}
            >
              {progressPct}%
            </span>
          </div>

          {/* Step checklist */}
          <div className="mt-3 space-y-0">
            {badge.steps.map((step) => (
              <StepRow
                key={step.label}
                label={step.label}
                status={step.status}
              />
            ))}
          </div>

          {/* Status pill */}
          <div className="mt-3 flex items-center gap-2 border-t border-white/[0.06] pt-3">
            <span className="text-[10px] font-medium text-[#78716c]">
              Status
            </span>
            <span
              className="inline-flex items-center gap-1 rounded-none px-2 py-0.5 text-[10px] font-semibold"
              style={{
                background: `${color}18`,
                color,
              }}
            >
              {statusLabel(achieved, inProgress)}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}

export default function BadgesPage() {
  const [hoveredBadgeId, setHoveredBadgeId] = useState<string | null>(null);
  const masteryBadges = useMemo(
    () => MOCK_BADGES.filter((b) => b.type === "mastery"),
    []
  );
  const tutorialBadges = useMemo(
    () => MOCK_BADGES.filter((b) => b.type === "tutorial"),
    []
  );
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
          <p className="mt-0.5 text-xs text-[#78716c]">
            Complete Learn → Practice → Master for each path.{" "}
            <span className="font-medium text-[#a8a29e]">
              {earnedCount} of {totalCount} earned
            </span>
          </p>
        </header>

        <section className="mb-8">
          <h2 className="mb-3 text-[10px] font-medium uppercase tracking-wider text-[#78716c]">
            Category Mastery
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {masteryBadges.map((badge, i) => (
              <BadgeCard
                key={badge.id}
                badge={badge}
                index={i}
                isExpanded={hoveredBadgeId === badge.id}
                onExpand={() => setHoveredBadgeId(badge.id)}
                onCollapse={() => setHoveredBadgeId(null)}
              />
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-3 text-[10px] font-medium uppercase tracking-wider text-[#78716c]">
            Tutorial Completion
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {tutorialBadges.map((badge, i) => (
              <BadgeCard
                key={badge.id}
                badge={badge}
                index={masteryBadges.length + i}
                isExpanded={hoveredBadgeId === badge.id}
                onExpand={() => setHoveredBadgeId(badge.id)}
                onCollapse={() => setHoveredBadgeId(null)}
              />
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
