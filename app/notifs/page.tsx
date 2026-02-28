"use client";

import { useMemo, useState, type ReactNode } from "react";
import TopBar from "@/components/layout/TopBar";
import { useAuth, initials } from "@/lib/auth-context";
import { MOCK_NOTIFICATIONS, type MockNotification, type MockNotificationType } from "@/lib/constants";
import {
  AlertTriangle,
  Award,
  Bell,
  Brain,
  BookOpen,
  ChevronDown,
  FileText,
  Mail,
  type LucideIcon,
} from "lucide-react";

type TabId = "updates" | "alerts";

const typeStyles: Record<
  MockNotificationType,
  { iconBgClass: string; iconTextClass: string; label: string }
> = {
  badge: {
    iconBgClass: "bg-app-blue/15",
    iconTextClass: "text-app-blue",
    label: "Badge",
  },
  content: {
    iconBgClass: "bg-app-accent/15",
    iconTextClass: "text-app-accentLight",
    label: "Content",
  },
  tutorial: {
    iconBgClass: "bg-app-safe/15",
    iconTextClass: "text-app-safe",
    label: "Tutorial",
  },
  alert: {
    iconBgClass: "bg-app-amber/15",
    iconTextClass: "text-app-amber",
    label: "Alert",
  },
  system: {
    iconBgClass: "bg-white/[0.06]",
    iconTextClass: "text-app-muted",
    label: "System",
  },
};

const avatarIcons: Record<MockNotification["avatar"], LucideIcon> = {
  Brain,
  FileText,
  BookOpen,
  AlertTriangle,
  Award,
  Mail,
};

function TabButton({
  id,
  active,
  onClick,
  children,
}: {
  id: TabId;
  active: boolean;
  onClick: (id: TabId) => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={() => onClick(id)}
      className={`relative px-3 py-2 text-xs font-semibold tracking-wide transition-colors ${
        active ? "text-white" : "text-app-muted hover:text-white"
      }`}
    >
      {children}
      {active && (
        <span className="absolute inset-x-0 -bottom-[1px] h-[2px] bg-app-blue" />
      )}
    </button>
  );
}

export default function NotifsPage() {
  const { user } = useAuth();
  const [tab, setTab] = useState<TabId>("updates");

  const displayName = user?.name ?? "Guest";
  const initialsStr = user ? initials(user.name) : "G";

  const items = useMemo(() => {
    if (tab === "alerts") return MOCK_NOTIFICATIONS.filter((n) => n.type === "alert");
    return MOCK_NOTIFICATIONS;
  }, [tab]);

  return (
    <>
      <TopBar />
      <main className="mx-auto max-w-[1440px] px-6 py-8">
        <div className="glass-card rounded-none border border-white/[0.08] p-0 overflow-hidden hover:!border-app-blue/30 hover:!shadow-[0_1px_0_0_rgba(255,255,255,0.08)_inset,_0_0_0_0.5px_rgba(255,255,255,0.06)_inset,_0_8px_40px_rgba(0,0,0,0.35),_0_0_60px_rgba(59,130,246,0.10)]">
          {/* In-panel top chrome (inspired by reference image) */}
          <div
            className="border-b border-white/[0.08] px-5 py-4"
            style={{
              background: "rgba(12, 10, 9, 0.72)",
              backdropFilter: "blur(32px) saturate(1.4)",
              WebkitBackdropFilter: "blur(32px) saturate(1.4)",
            }}
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  aria-label="Notifications"
                  className="relative grid h-10 w-10 place-items-center border border-white/[0.08] bg-app-blue text-white transition-colors hover:bg-app-blueDark"
                >
                  <Bell className="h-4 w-4" />
                  <span className="absolute right-2 top-2 h-1.5 w-1.5 bg-[#ef4444]" />
                </button>
              </div>

              <button
                type="button"
                className="flex items-center gap-3 border border-white/[0.08] bg-white/[0.03] px-3 py-2 transition-colors hover:bg-white/[0.06]"
                aria-label="User menu"
              >
                <div className="grid h-9 w-9 place-items-center bg-app-blue text-[12px] font-bold text-white">
                  {initialsStr}
                </div>
                <div className="min-w-0 text-left">
                  <div className="truncate text-sm font-semibold text-white">
                    {displayName}
                  </div>
                  <div className="text-[11px] text-app-muted">Manager</div>
                </div>
                <ChevronDown className="h-4 w-4 text-app-muted" />
              </button>
            </div>

            <div className="mt-4 flex items-end justify-between gap-4">
              <div>
                <div className="text-[12px] font-semibold text-app-muted">Notifications</div>
                <div className="text-2xl font-semibold text-white leading-tight">
                  Notifications
                </div>
              </div>

              <div className="flex items-center border-b border-white/[0.08]">
                <TabButton id="updates" active={tab === "updates"} onClick={setTab}>
                  Updates
                </TabButton>
                <TabButton id="alerts" active={tab === "alerts"} onClick={setTab}>
                  Alerts
                </TabButton>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="relative bg-[#0c0a09]">
            <div className="min-h-[520px]">
              <div className="p-5">
                <div className="glass-subtle rounded-none border border-white/[0.07] overflow-hidden">
                  <div className="divide-y divide-white/[0.06]">
                    {items.map((n) => {
                      const style = typeStyles[n.type];
                      const Icon = avatarIcons[n.avatar];
                      return (
                        <div
                          key={n.id}
                          className="flex items-start gap-3 px-4 py-3 transition-colors hover:bg-white/[0.03]"
                        >
                          <div
                            className={`mt-0.5 grid h-10 w-10 shrink-0 place-items-center border border-white/[0.08] ${style.iconBgClass}`}
                          >
                            <Icon className={`h-4 w-4 ${style.iconTextClass}`} />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0">
                                <div className="truncate text-sm font-medium text-white">
                                  {n.title}
                                </div>
                                <div className="mt-0.5 text-[11px] text-app-muted">
                                  {style.label}
                                </div>
                              </div>
                              <div className="shrink-0 text-[11px] text-app-muted">
                                {n.time}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}

                    {items.length === 0 && (
                      <div className="px-4 py-10 text-center text-sm text-app-muted">
                        No alerts yet.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
