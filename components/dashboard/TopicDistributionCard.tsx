"use client";

import { MOCK_TOPIC_DISTRIBUTION } from "@/lib/constants";

export default function TopicDistributionCard() {
  const total = MOCK_TOPIC_DISTRIBUTION.reduce((acc, t) => acc + t.value, 0);

  return (
    <div className="glass-card p-6">
      <h3 className="mb-4 text-sm font-semibold text-white">Topic Distribution</h3>
      <div className="space-y-3">
        {MOCK_TOPIC_DISTRIBUTION.map((topic) => {
          const pct = Math.round((topic.value / total) * 100);
          return (
            <div key={topic.name}>
              <div className="mb-1 flex items-center justify-between">
                <span className="text-xs text-[#a8a29e]">{topic.name}</span>
                <span className="text-xs font-medium text-white">{pct}%</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-white/[0.06]">
                <div
                  className="h-full rounded-full transition-all"
                  style={{ width: `${pct}%`, background: topic.color }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
