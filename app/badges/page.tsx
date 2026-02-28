"use client";

import TopBar from "@/components/layout/TopBar";
import { useState } from "react";
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
  Lock,
  MoreHorizontal,
} from "lucide-react";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Brain,
  Coins,
  Globe,
  GraduationCap,
  Wallet,
  Shield,
  Layers,
};

const MORPH_DELAYS = [0, 1.4, 2.8, 0.7, 2.1, 3.5, 1];

function statusOf(badge: (typeof MOCK_BADGES)[number]) {
  if (badge.achieved) return "completed" as const;
  if (badge.steps.some((s) => s.status === "active")) return "active" as const;
  return "locked" as const;
}

function accentFor(status: "completed" | "active" | "locked") {
  if (status === "completed") return "#22c55e";
  if (status === "active") return "#3b82f6";
  return "#78716c";
}

function StepRow({ label, status }: { label: string; status: BadgeStepStatus }) {
  return (
    <div className="flex items-center gap-3 py-2">
      <div
        className="flex h-5 w-5 shrink-0 items-center justify-center"
        style={{
          background:
            status === "completed"
              ? "#22c55e"
              : status === "active"
                ? "#3b82f6"
                : "#e5e7eb",
        }}
      >
        {status === "completed" && <Check className="h-3 w-3 text-white" />}
        {status === "active" && (
          <span className="h-1.5 w-1.5 animate-pulse bg-white" />
        )}
      </div>
      <span
        className={`text-sm ${
          status === "completed"
            ? "text-gray-900 line-through"
            : status === "active"
              ? "text-gray-900 font-medium"
              : "text-gray-400"
        }`}
      >
        {label}
      </span>
    </div>
  );
}

export default function BadgesPage() {
  const [selectedId, setSelectedId] = useState<string | null>(
    MOCK_BADGES[0]?.id ?? null
  );

  const earnedCount = MOCK_BADGES.filter((b) => b.achieved).length;
  const selectedBadge = MOCK_BADGES.find((b) => b.id === selectedId) ?? null;

  const selectedStatus = selectedBadge ? statusOf(selectedBadge) : "locked";
  const SelectedIcon = selectedBadge
    ? (ICON_MAP[selectedBadge.icon] ?? Brain)
    : Brain;
  const completedSteps = selectedBadge
    ? selectedBadge.steps.filter((s) => s.status === "completed").length
    : 0;
  const totalSteps = selectedBadge?.steps.length ?? 0;
  const progressPct = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;

  return (
    <>
      <TopBar />
      <main className="mx-auto max-w-[1200px] px-8 py-10">
        <header className="mb-8">
          <h1 className="text-2xl font-semibold tracking-tight text-white">
            Badges
          </h1>
          <p className="mt-1 text-sm text-[#78716c]">
            Earn badges by mastering learning paths. {earnedCount} of{" "}
            {MOCK_BADGES.length} earned.
          </p>
        </header>

        {/* Shape grid */}
        <div className="flex flex-wrap items-center gap-6">
          {MOCK_BADGES.map((badge, i) => {
            const status = statusOf(badge);
            const accent = accentFor(status);
            const Icon = ICON_MAP[badge.icon] ?? Brain;
            const isSelected = selectedId === badge.id;
            const useAlt = i % 2 === 1;

            return (
              <button
                key={badge.id}
                type="button"
                onClick={() => setSelectedId(badge.id)}
                className="group flex flex-col items-center gap-2"
              >
                <div
                  className={`relative flex h-[120px] w-[120px] items-center justify-center transition-all duration-300 ${
                    isSelected
                      ? "badge-selected"
                      : useAlt
                        ? "badge-morph-alt"
                        : "badge-morph"
                  }`}
                  style={{
                    animationDelay: `${MORPH_DELAYS[i % MORPH_DELAYS.length]}s`,
                    background:
                      status === "locked"
                        ? "rgba(255,255,255,0.03)"
                        : `${accent}10`,
                    border: isSelected
                      ? `2px solid ${accent}`
                      : `1px solid ${accent}33`,
                    boxShadow: isSelected
                      ? `0 0 24px ${accent}22`
                      : "none",
                  }}
                >
                  {status === "locked" ? (
                    <Lock className="h-6 w-6 text-[#78716c]" />
                  ) : (
                    <div style={{ color: accent }}>
                      <Icon className="h-7 w-7" />
                    </div>
                  )}

                  {status === "completed" && (
                    <div
                      className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center bg-[#22c55e]"
                    >
                      <Check className="h-3 w-3 text-white" />
                    </div>
                  )}
                </div>

                <span
                  className={`text-xs font-medium transition-colors ${
                    isSelected ? "text-white" : "text-[#a8a29e]"
                  }`}
                >
                  {badge.title}
                </span>
              </button>
            );
          })}
        </div>

        {/* Detail card (Pinterest-style, white panel) */}
        {selectedBadge && (
          <div className="mt-8 panel-white p-0 overflow-hidden" style={{ maxWidth: 480 }}>
            {/* Card header */}
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
              <div className="flex items-center gap-3">
                <div
                  className="flex h-9 w-9 items-center justify-center"
                  style={{
                    background: `${accentFor(selectedStatus)}15`,
                    color: accentFor(selectedStatus),
                  }}
                >
                  <SelectedIcon className="h-5 w-5" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900">
                  {selectedBadge.title}
                </h2>
              </div>
              <button className="p-1 text-gray-400 hover:text-gray-600 transition-colors">
                <MoreHorizontal className="h-5 w-5" />
              </button>
            </div>

            {/* Progress bar */}
            <div className="px-6 pt-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <span
                    className="flex h-5 w-5 items-center justify-center text-[10px] font-bold"
                    style={{
                      background: `${accentFor(selectedStatus)}15`,
                      color: accentFor(selectedStatus),
                    }}
                  >
                    {completedSteps}
                  </span>
                  <span className="text-xs text-gray-400">
                    of {totalSteps}
                  </span>
                </div>
                <div className="flex-1 h-2 bg-gray-100">
                  <div
                    className="h-full transition-all duration-500"
                    style={{
                      width: `${progressPct}%`,
                      background: accentFor(selectedStatus),
                    }}
                  />
                </div>
                <span className="text-xs font-semibold tabular-nums text-gray-500">
                  {progressPct}%
                </span>
              </div>
            </div>

            {/* Step checklist */}
            <div className="px-6 py-3 divide-y divide-gray-100">
              {selectedBadge.steps.map((step) => (
                <StepRow
                  key={step.label}
                  label={step.label}
                  status={step.status}
                />
              ))}
            </div>

            {/* Footer tags */}
            <div className="flex items-center gap-3 border-t border-gray-100 px-6 py-4">
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-medium text-gray-400">
                  Status
                </span>
                <span
                  className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-semibold"
                  style={{
                    background: `${accentFor(selectedStatus)}15`,
                    color: accentFor(selectedStatus),
                  }}
                >
                  {selectedStatus === "completed"
                    ? "Completed"
                    : selectedStatus === "active"
                      ? "In Progress"
                      : "Locked"}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-medium text-gray-400">
                  Type
                </span>
                <span className="inline-flex items-center px-2 py-0.5 text-[11px] font-semibold bg-gray-100 text-gray-600">
                  {selectedBadge.type === "mastery" ? "Mastery" : "Tutorial"}
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="border-t border-gray-100 px-6 py-4">
              <p className="text-sm text-gray-500 leading-relaxed">
                {selectedBadge.description}
              </p>
            </div>
          </div>
        )}
      </main>
    </>
  );
}
