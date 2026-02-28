"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Search, Bell, Settings, BookOpen, LogOut } from "lucide-react";
import { useAuth, initials } from "@/lib/auth-context";

const navItems = [
  { label: "Dashboard", href: "/" },
  { label: "Notifs", href: "/notifs" },
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
    router.push("/login");
    router.refresh();
  }

  const displayName = user?.name ?? "Guest";
  const displayHandle = user?.handle ?? "@guest";
  const initialsStr = user ? initials(user.name) : "G";

  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.06]" style={{ background: "rgba(12, 10, 9, 0.85)", backdropFilter: "blur(40px) saturate(1.4)", WebkitBackdropFilter: "blur(40px) saturate(1.4)" }}>
      <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-8">
        <div className="flex items-center gap-10">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ background: "linear-gradient(135deg, #ea580c, #f59e0b)" }}>
              <BookOpen className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-semibold tracking-tight text-white">BadgeForge</span>
          </Link>

          <nav className="flex gap-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                    isActive
                      ? "text-white"
                      : "text-[#a8a29e] hover:text-white hover:bg-white/[0.04]"
                  }`}
                  style={isActive ? { background: "rgba(234, 88, 12, 0.15)", color: "#f97316" } : undefined}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex max-w-md flex-1 mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#78716c]" />
            <input
              type="text"
              placeholder="Search topics, articles..."
              className="w-full rounded-xl border border-white/[0.06] bg-white/[0.03] py-2.5 pl-10 pr-4 text-sm text-white placeholder-[#78716c] transition-colors focus:border-[#ea580c]/30 focus:outline-none focus:bg-white/[0.05]"
            />
            <kbd className="absolute right-3.5 top-1/2 -translate-y-1/2 rounded-md border border-white/[0.08] bg-white/[0.04] px-1.5 py-0.5 text-[10px] text-[#78716c]">
              ⌘K
            </kbd>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="relative rounded-lg p-2.5 text-[#a8a29e] transition-colors hover:bg-white/[0.05] hover:text-white">
            <Bell className="h-[18px] w-[18px]" />
            <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-[#ea580c]" />
          </button>
          <button className="rounded-lg p-2.5 text-[#a8a29e] transition-colors hover:bg-white/[0.05] hover:text-white">
            <Settings className="h-[18px] w-[18px]" />
          </button>

          <div className="ml-2 relative" ref={menuRef}>
            <button
              type="button"
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.03] py-1.5 pl-1.5 pr-4 hover:bg-white/[0.05] transition-colors"
            >
              <div
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold text-white"
                style={{ background: "linear-gradient(135deg, #ea580c, #f59e0b)" }}
              >
                {initialsStr}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-medium text-white leading-tight">{displayName}</p>
                <p className="text-[11px] text-[#78716c]">{displayHandle}</p>
              </div>
            </button>
            {userMenuOpen && (
              <div className="absolute right-0 top-full mt-1 w-48 rounded-xl border border-white/[0.08] bg-[#1c1917] py-1 shadow-xl z-50">
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
