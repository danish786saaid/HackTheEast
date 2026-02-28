"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Bell,
  BookOpen,
  LogOut,
  Settings,
  ChevronDown,
} from "lucide-react";
import { useAuth, initials } from "@/lib/auth-context";

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

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleLogout() {
    logout();
    setUserMenuOpen(false);
    router.push("/onboarding");
    router.refresh();
  }

  const displayName = user?.name ?? "Guest";
  const initialsStr = user ? initials(user.name) : "G";

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
          <button className="relative p-2.5 text-[#a8a29e] transition-colors hover:bg-white/[0.05] hover:text-white">
            <Bell className="h-[18px] w-[18px]" />
            <span className="absolute right-2 top-2 h-1.5 w-1.5 bg-[#3b82f6]" />
          </button>

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
