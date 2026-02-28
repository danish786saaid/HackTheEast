"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  AlertTriangle,
  Award,
  Bell,
  BookOpen,
  Brain,
  LogOut,
  Mail,
  Settings,
  ChevronDown,
  FileText,
} from "lucide-react";
import { useAuth, initials } from "@/lib/auth-context";
import { MOCK_NOTIFICATIONS, type MockNotification, type MockNotificationType } from "@/lib/constants";

const navItems = [
  { label: "Dashboard", href: "/" },
  { label: "Tutorials", href: "/tutorials" },
  { label: "Badges", href: "/badges" },
  { label: "News", href: "/news" },
];

export default function TopBar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const [notifsOpen, setNotifsOpen] = useState(false);
  const [hasUnseenNotifs, setHasUnseenNotifs] = useState(true);
  const notifsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
      if (notifsRef.current && !notifsRef.current.contains(e.target as Node)) {
        setNotifsOpen(false);
      }
    }
    function handleEscape(e: KeyboardEvent) {
      if (e.key !== "Escape") return;
      setUserMenuOpen(false);
      setNotifsOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  function handleLogout() {
    logout();
    setUserMenuOpen(false);
    setNotifsOpen(false);
    router.push("/onboarding/login");
    router.refresh();
  }

  const displayName = user?.name ?? "Guest";
  const initialsStr = user ? initials(user.name) : "G";

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

  const avatarIcons: Record<MockNotification["avatar"], React.ComponentType<{ className?: string }>> =
    {
      Brain,
      FileText,
      BookOpen,
      AlertTriangle,
      Award,
      Mail,
    };

  function toggleNotifs() {
    setNotifsOpen((v) => {
      const next = !v;
      if (next) setHasUnseenNotifs(false);
      return next;
    });
    setUserMenuOpen(false);
  }

  return (
    <header
      className="sticky top-0 z-50 border-b border-white/[0.06]"
      style={{
        background: "rgba(12, 10, 9, 0.92)",
        backdropFilter: "blur(40px) saturate(1.4)",
        WebkitBackdropFilter: "blur(40px) saturate(1.4)",
      }}
    >
      <div className="mx-auto flex h-14 max-w-[1600px] items-center justify-between px-6">
        {/* Left: logo + nav */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center bg-[#3b82f6]">
              <BookOpen className="h-4 w-4 text-white" />
            </div>
            <span className="text-[15px] font-semibold tracking-tight text-white">
              BadgeForge
            </span>
          </Link>

          <nav className="flex gap-0.5">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`px-3.5 py-1.5 text-[13px] font-medium transition-colors ${
                    isActive
                      ? "bg-[#3b82f6] text-white"
                      : "text-[#a8a29e] hover:text-white hover:bg-white/[0.05]"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right: actions */}
        <div className="flex items-center gap-1">
          <div className="relative" ref={notifsRef}>
            <button
              type="button"
              aria-label="Notifications"
              aria-haspopup="menu"
              aria-expanded={notifsOpen}
              onClick={toggleNotifs}
              className={`relative p-2.5 transition-colors hover:bg-white/[0.05] hover:text-[#3b82f6] ${
                notifsOpen ? "text-[#3b82f6]" : "text-[#a8a29e]"
              }`}
            >
              <Bell className="h-[18px] w-[18px]" />
              {hasUnseenNotifs && (
                <span className="absolute right-2 top-2 h-1.5 w-1.5 bg-[#3b82f6]" />
              )}
            </button>

            {notifsOpen && (
              <div
                role="menu"
                className="absolute right-0 top-full mt-2 w-[360px] border border-white/[0.08] bg-[#1c1917] shadow-xl z-50 overflow-hidden"
              >
                <div className="flex items-center justify-between gap-3 border-b border-white/[0.08] px-4 py-3">
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-white">Notifications</div>
                    <div className="text-[11px] text-[#78716c]">
                      Recent updates from your learning paths
                    </div>
                  </div>
                  <Link
                    href="/notifs"
                    onClick={() => setNotifsOpen(false)}
                    className="shrink-0 text-xs font-semibold text-[#3b82f6] hover:underline"
                  >
                    View all
                  </Link>
                </div>

                <div className="max-h-[420px] overflow-auto">
                  {MOCK_NOTIFICATIONS.slice(0, 6).map((n) => {
                    const style = typeStyles[n.type];
                    const Icon = avatarIcons[n.avatar];
                    return (
                      <div
                        key={n.id}
                        className="flex items-start gap-3 px-4 py-3 transition-colors hover:bg-white/[0.06]"
                      >
                        <div
                          className={`mt-0.5 grid h-9 w-9 shrink-0 place-items-center border border-white/[0.08] ${style.iconBgClass}`}
                        >
                          <Icon className={`h-4 w-4 ${style.iconTextClass}`} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="truncate text-sm text-white">{n.title}</div>
                          <div className="mt-0.5 flex items-center justify-between gap-3">
                            <div className="text-[11px] text-[#78716c]">{style.label}</div>
                            <div className="text-[11px] text-[#78716c]">{n.time}</div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <div className="ml-2 relative" ref={menuRef}>
            <button
              type="button"
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-2.5 border border-white/[0.06] bg-white/[0.03] py-1.5 pl-1.5 pr-3 hover:bg-white/[0.05] transition-colors"
            >
              <div className="flex h-7 w-7 shrink-0 items-center justify-center bg-[#3b82f6] text-[11px] font-bold text-white">
                {initialsStr}
              </div>
              <span className="text-sm font-medium text-white">
                {displayName}
              </span>
              <ChevronDown className="h-3.5 w-3.5 text-[#78716c]" />
            </button>

            {userMenuOpen && (
              <div className="absolute right-0 top-full mt-1 w-48 border border-white/[0.08] bg-[#1c1917] py-1 shadow-xl z-50">
                <a
                  href="/settings"
                  className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-[#a8a29e] hover:bg-white/[0.06] hover:text-white transition-colors"
                >
                  <Settings className="h-4 w-4" />
                  Settings
                </a>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-[#a8a29e] hover:bg-white/[0.06] hover:text-white transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  Log out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
