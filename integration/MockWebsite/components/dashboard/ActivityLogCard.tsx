"use client";

import { MOCK_ACTIVITIES } from "@/lib/constants";

export default function ActivityLogCard() {
  return (
    <div className="glass-card p-6">
      <h3 className="mb-4 text-sm font-semibold text-white">Recent Activity</h3>
      <div className="space-y-3">
        {MOCK_ACTIVITIES.map((item) => (
          <div key={item.id} className="flex items-start gap-3">
            <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#f97316]" />
            <div>
              <p className="text-sm text-white">{item.action}</p>
              <p className="text-[11px] text-[#78716c]">{item.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
