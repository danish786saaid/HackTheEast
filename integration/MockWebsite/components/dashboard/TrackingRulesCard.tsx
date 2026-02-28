"use client";

import { MOCK_TRACKING_RULES } from "@/lib/constants";

export default function TrackingRulesCard() {
  return (
    <div className="glass-card p-6">
      <h3 className="mb-4 text-sm font-semibold text-white">Active Tracking Rules</h3>
      <div className="space-y-2.5">
        {MOCK_TRACKING_RULES.map((rule) => (
          <div
            key={rule.id}
            className="flex items-center gap-3 rounded-lg border border-white/[0.04] bg-white/[0.02] p-3"
          >
            <div
              className="h-2 w-2 shrink-0 rounded-full"
              style={{ background: rule.status === "active" ? "#22c55e" : "#78716c" }}
            />
            <p className="flex-1 text-sm text-white">{rule.rule}</p>
            <span
              className="shrink-0 rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase"
              style={{
                background: rule.status === "active" ? "rgba(34,197,94,0.1)" : "rgba(120,113,108,0.15)",
                color: rule.status === "active" ? "#22c55e" : "#78716c",
              }}
            >
              {rule.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
