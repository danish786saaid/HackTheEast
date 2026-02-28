"use client";

import { MOCK_ALERTS } from "@/lib/constants";

const severityStyle = {
  safe: { bg: "rgba(34, 197, 94, 0.1)", color: "#22c55e", label: "Info" },
  warning: { bg: "rgba(245, 158, 11, 0.1)", color: "#f59e0b", label: "Update" },
  danger: { bg: "rgba(239, 68, 68, 0.1)", color: "#ef4444", label: "Critical" },
};

export default function AlertsFeedCard() {
  return (
    <div className="glass-card p-6">
      <h3 className="mb-4 text-sm font-semibold text-white">Breaking Updates</h3>
      <div className="space-y-2.5">
        {MOCK_ALERTS.map((alert) => {
          const style = severityStyle[alert.severity];
          return (
            <div key={alert.id} className="flex items-start gap-3 rounded-lg p-2.5 transition-colors hover:bg-white/[0.03]">
              <span
                className="mt-0.5 shrink-0 rounded-md px-1.5 py-0.5 text-[10px] font-semibold uppercase"
                style={{ background: style.bg, color: style.color }}
              >
                {style.label}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm text-white leading-snug">{alert.title}</p>
                <p className="mt-0.5 text-[11px] text-[#78716c]">{alert.time}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
