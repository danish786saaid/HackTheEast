"use client";

import { useState, useEffect } from "react";
import {
  Link2,
  Camera,
  Lock,
  LogOut,
  GraduationCap,
  Presentation,
  Building2,
  Sprout,
  Flame,
  Zap,
  Eye,
  EyeOff,
  X,
  Globe,
  Bell,
  HelpCircle,
} from "lucide-react";
import TopBar from "@/components/layout/TopBar";
import { useAuth, initials } from "@/lib/auth-context";
import {
  loadUserPreferences,
  saveUserPreferences,
  ROLES,
  TOPICS,
  LEVELS,
} from "@/lib/user-preferences";

const LANGUAGES = [
  { value: "en", label: "English" },
  { value: "yue", label: "Cantonese (廣東話)" },
];

export default function SettingsPage() {
  const { user, logout, updateProfile } = useAuth();
  const [displayName, setDisplayName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [emailNotif, setEmailNotif] = useState(true);
  const [inAppNotif, setInAppNotif] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(false);
  const [language, setLanguage] = useState("en");
  const [role, setRole] = useState("learner");
  const [interests, setInterests] = useState<string[]>([]);
  const [level, setLevel] = useState("intermediate");
  const [accountExpanded, setAccountExpanded] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [toast, setToast] = useState<{
    type: "success" | "error";
    msg: string;
  } | null>(null);

  useEffect(() => {
    if (user) setDisplayName(user.name);
  }, [user]);

  useEffect(() => {
    const prefs = loadUserPreferences();
    setRole(prefs.role);
    setInterests(prefs.interests.slice(0, 3)); // max 3
    setLevel(prefs.level);
  }, []);

  const showToast = (type: "success" | "error", msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    updateProfile({ name: displayName.trim() || user.name });
    showToast("success", "Profile saved.");
  };

  const toggleInterest = (topic: string) => {
    setInterests((prev) => {
      if (prev.includes(topic)) return prev.filter((t) => t !== topic);
      if (prev.length >= 3) return prev;
      return [...prev, topic];
    });
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!oldPassword || !newPassword || !confirmPassword) {
      showToast("error", "All password fields are required.");
      return;
    }
    if (newPassword.length < 8) {
      showToast("error", "Password must be at least 8 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast("error", "Passwords do not match.");
      return;
    }
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setAccountExpanded(false);
    showToast("success", "Password updated.");
  };

  // Auto-save preferences when role, interests, or level change
  useEffect(() => {
    if (interests.length === 0) return;
    saveUserPreferences({ role, interests, level });
  }, [role, interests, level]);

  const handleAvatarClick = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file?.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = () => setAvatarUrl(reader.result as string);
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const initialLetters = user ? initials(user.name) : "G";

  const Toggle = ({
    value,
    onToggle,
  }: {
    value: boolean;
    onToggle: () => void;
  }) => (
    <button
      type="button"
      onClick={onToggle}
      disabled={!user}
      className={`relative h-5 w-9 shrink-0 transition-colors disabled:opacity-50 ${
        value ? "bg-[#3b82f6]" : "bg-white/20"
      }`}
    >
      <span
        className={`absolute top-0.5 left-0.5 h-4 w-4 bg-white shadow-sm transition-transform ${
          value ? "translate-x-4" : "translate-x-0"
        }`}
      />
    </button>
  );

  const cardHover =
    "transition-all duration-200 hover:border-[#3b82f6]/40 hover:shadow-[0_0_24px_rgba(59,130,246,0.08)]";

  return (
    <>
      <TopBar />
      <div
        className="min-h-[calc(100vh-56px)] w-full px-4 py-6 sm:px-6 sm:py-8"
        style={{ background: "#0c0a09" }}
      >
        <div className="mx-auto w-full max-w-5xl">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Settings
            </h1>
            <p className="mt-1 text-sm text-[#78716c]">
              Manage your account, preferences, and integrations.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:auto-rows-auto">

            {/* ═══ ROW 1: Profile (2) | Experience (2) ═══ */}
            <div
              className={`border border-white/[0.08] bg-white p-5 sm:col-span-2 lg:col-span-2 ${cardHover}`}
            >
              <form onSubmit={handleSaveProfile} className="flex flex-col">
                <div className="flex items-start gap-4">
                  <button
                    type="button"
                    onClick={handleAvatarClick}
                    className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden bg-[#3b82f6] text-xl font-bold text-white"
                  >
                    {avatarUrl ? (
                      <img
                        src={avatarUrl}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      initialLetters
                    )}
                    <span className="absolute bottom-0 right-0 flex h-5 w-5 items-center justify-center bg-[#2563eb] text-white">
                      <Camera className="h-2.5 w-2.5" />
                    </span>
                  </button>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">
                      Display name
                    </p>
                    <input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      disabled={!user}
                      className="mt-1 w-full border-0 border-b border-gray-200 bg-transparent py-1.5 text-lg font-semibold text-gray-900 placeholder-gray-400 focus:border-[#3b82f6] focus:outline-none disabled:opacity-50"
                      placeholder="Your name"
                    />
                  </div>
                </div>
                <div className="mt-4 space-y-3">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">
                      Email
                    </p>
                    <p className="mt-1 text-sm text-gray-900">
                      {user?.email ?? "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">
                      Handle
                    </p>
                    <p className="mt-1 text-sm text-gray-900">
                      @{user?.handle ?? "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">
                      Member since
                    </p>
                    <p className="mt-1 text-sm text-gray-900">
                      {new Date().toLocaleDateString("en-US", {
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>
                {user && (
                  <button
                    type="submit"
                    className="mt-4 w-full bg-[#3b82f6] py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#2563eb]"
                  >
                    Save profile
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setAccountExpanded(true)}
                  className="mt-3 flex w-full items-center gap-2 border-t border-gray-200 pt-4 text-left text-gray-600 transition-colors hover:text-[#3b82f6]"
                >
                  <Lock className="h-3.5 w-3.5" />
                  <span className="text-sm font-medium">Change password</span>
                </button>
              </form>
            </div>

            <div
              className={`border border-white/[0.08] bg-white p-5 sm:col-span-2 lg:col-span-2 ${cardHover}`}
            >
              <h3 className="text-sm font-semibold text-gray-900">
                Experience level
              </h3>
              <p className="mt-1 text-xs text-gray-500">
                We&apos;ll adapt the depth and complexity of your learning paths.
              </p>
              <div className="mt-3 space-y-2">
                {LEVELS.map((l) => {
                  const Icon =
                    l.id === "beginner"
                      ? Sprout
                      : l.id === "intermediate"
                        ? Flame
                        : Zap;
                  const isSelected = level === l.id;
                  return (
                    <button
                      key={l.id}
                      type="button"
                      onClick={() => setLevel(l.id)}
                      className={`flex w-full items-start gap-3 border p-3 text-left transition-all ${
                        isSelected
                          ? "border-[#3b82f6] bg-[#3b82f6]/10"
                          : "border-gray-200 bg-gray-50/50 hover:border-[#3b82f6]/40 hover:bg-[#3b82f6]/5"
                      }`}
                    >
                      <Icon
                        className={`mt-0.5 h-4 w-4 shrink-0 ${
                          isSelected ? "text-[#3b82f6]" : "text-gray-400"
                        }`}
                      />
                      <div>
                        <p
                          className={`text-sm font-medium ${
                            isSelected ? "text-[#3b82f6]" : "text-gray-400"
                          }`}
                        >
                          {l.label}
                        </p>
                        <p className="mt-0.5 text-[11px] text-gray-500">
                          {l.description}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ═══ ROW 2: Topics (3) | Notifications (1) ═══ */}
            <div
              className={`border border-white/[0.08] bg-white p-5 sm:col-span-2 lg:col-span-3 ${cardHover}`}
            >
              <h3 className="text-sm font-semibold text-gray-900">
                Topics of interest
              </h3>
              <p className="mt-1 text-xs text-gray-500">
                Select up to 3. We use these to curate your content feed and
                learning paths.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {TOPICS.map((topic) => {
                  const isSelected = interests.includes(topic);
                  const isDisabled = !isSelected && interests.length >= 3;
                  return (
                    <button
                      key={topic}
                      type="button"
                      onClick={() => toggleInterest(topic)}
                      disabled={isDisabled}
                      className={`px-3 py-1.5 text-xs font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed ${
                        isSelected
                          ? "bg-[#3b82f6] text-white"
                          : "border border-gray-200 bg-gray-50/50 text-gray-600 hover:border-[#3b82f6]/40 hover:bg-[#3b82f6]/5 hover:text-[#3b82f6]"
                      }`}
                    >
                      {topic}
                    </button>
                  );
                })}
              </div>
              {interests.length === 0 && (
                <p className="mt-2 text-[11px] text-amber-600">
                  Select at least one topic (max 3).
                </p>
              )}
              {interests.length >= 3 && (
                <p className="mt-2 text-[11px] text-gray-500">
                  Maximum 3 topics selected.
                </p>
              )}
            </div>

            <div
              className={`border border-white/[0.08] bg-white p-4 lg:col-span-1 ${cardHover}`}
            >
              <div className="flex items-center gap-2 mb-2">
                <Bell className="h-3.5 w-3.5 text-gray-400" />
                <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">
                  Notifications
                </p>
              </div>
              <div className="space-y-2">
                {[
                  { label: "Email", value: emailNotif, set: setEmailNotif },
                  { label: "In-app", value: inAppNotif, set: setInAppNotif },
                  {
                    label: "Weekly digest",
                    value: weeklyDigest,
                    set: setWeeklyDigest,
                  },
                ].map(({ label, value, set }) => (
                  <div
                    key={label}
                    className="flex items-center justify-between py-0.5"
                  >
                    <span className="text-sm text-gray-700">{label}</span>
                    <Toggle value={value} onToggle={() => set((v) => !v)} />
                  </div>
                ))}
              </div>
            </div>

            {/* ═══ ROW 3: Role (2) | Language (1) | Integrations (1) ═══ */}
            <div
              className={`border border-white/[0.08] bg-white p-5 sm:col-span-2 lg:col-span-2 ${cardHover}`}
            >
              <h3 className="text-sm font-semibold text-gray-900">
                How you use BadgeForge
              </h3>
              <p className="mt-1 text-xs text-gray-500">
                We use this to tailor your experience.
              </p>
              <div className="mt-3 space-y-2">
                {ROLES.map((r) => {
                  const Icon =
                    r.id === "learner"
                      ? GraduationCap
                      : r.id === "educator"
                        ? Presentation
                        : Building2;
                  const isSelected = role === r.id;
                  return (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => setRole(r.id)}
                      className={`flex w-full items-start gap-3 border p-3 text-left transition-all ${
                        isSelected
                          ? "border-[#3b82f6] bg-[#3b82f6]/10"
                          : "border-gray-200 bg-gray-50/50 hover:border-[#3b82f6]/40 hover:bg-[#3b82f6]/5"
                      }`}
                    >
                      <Icon
                        className={`mt-0.5 h-4 w-4 shrink-0 ${
                          isSelected ? "text-[#3b82f6]" : "text-gray-400"
                        }`}
                      />
                      <div>
                        <p
                          className={`text-sm font-medium ${
                            isSelected ? "text-[#3b82f6]" : "text-gray-400"
                          }`}
                        >
                          {r.label}
                        </p>
                        <p className="mt-0.5 text-[11px] text-gray-500">
                          {r.description}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div
              className={`border border-white/[0.08] bg-white p-4 lg:col-span-1 ${cardHover}`}
            >
              <div className="flex items-center gap-2 mb-2">
                <Globe className="h-4 w-4 text-gray-400" />
                <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">
                  Language
                </p>
              </div>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full border-0 bg-transparent text-lg font-bold text-gray-900 focus:outline-none cursor-pointer"
              >
                {LANGUAGES.map((o) => (
                  <option
                    key={o.value}
                    value={o.value}
                    className="bg-[#0c0a09] text-white"
                  >
                    {o.label}
                  </option>
                ))}
              </select>
            </div>

            <div
              className={`border border-white/[0.08] bg-white p-4 lg:col-span-1 ${cardHover}`}
            >
              <div className="flex items-center gap-2 mb-2">
                <Link2 className="h-3.5 w-3.5 text-gray-400" />
                <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">
                  Integrations
                </p>
              </div>
              <div className="space-y-2">
                {["Google", "GitHub"].map((label) => (
                  <div
                    key={label}
                    className="flex items-center justify-between py-0.5"
                  >
                    <span className="text-sm text-gray-700">{label}</span>
                    <button className="text-xs font-medium text-[#3b82f6] transition-colors hover:text-[#2563eb]">
                      Connect
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* ═══ ROW 4: Help (1) | Log out (3) ═══ */}
            <div
              className={`border border-white/[0.08] bg-white p-4 lg:col-span-1 ${cardHover}`}
            >
              <div className="flex items-center gap-2 mb-2">
                <HelpCircle className="h-3.5 w-3.5 text-gray-400" />
                <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">
                  Help & support
                </p>
              </div>
              <p className="text-sm text-gray-700">Need assistance?</p>
              <a
                href="mailto:info@oax.org"
                className="mt-1 block text-xs font-medium text-[#3b82f6] hover:text-[#2563eb]"
              >
                Contact support →
              </a>
            </div>

            <div
              className={`flex items-center justify-center border border-white/[0.08] bg-white sm:col-span-2 lg:col-span-3 ${cardHover}`}
            >
              <button
                type="button"
                onClick={() => {
                  logout();
                  window.location.href = "/onboarding";
                }}
                className="flex w-full h-full items-center justify-center gap-2 p-4 text-sm font-medium text-gray-500 transition-colors hover:text-[#3b82f6]"
              >
                <LogOut className="h-3.5 w-3.5" />
                Log out
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Change Password Modal ── */}
      {accountExpanded && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className={`w-full max-w-md border border-white/[0.08] bg-white shadow-2xl ${cardHover}`}>
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
              <h2 className="text-lg font-bold text-gray-900">
                Change Password
              </h2>
              <button
                type="button"
                onClick={() => setAccountExpanded(false)}
                className="text-gray-400 transition-colors hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleChangePassword} className="px-6 py-5 space-y-4">
              <div>
                <label className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">
                  Current password
                </label>
                <div className="relative mt-1">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    className="w-full border border-gray-200 bg-gray-50/50 px-3 py-2.5 pr-9 text-sm text-gray-900 placeholder-gray-400 focus:border-[#3b82f6] focus:outline-none"
                    placeholder="Enter current password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff className="h-3.5 w-3.5" />
                    ) : (
                      <Eye className="h-3.5 w-3.5" />
                    )}
                  </button>
                </div>
              </div>
              <div>
                <label className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">
                  New password
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="mt-1 w-full border border-gray-200 bg-gray-50/50 px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-[#3b82f6] focus:outline-none"
                  placeholder="Min 8 characters"
                />
              </div>
              <div>
                <label className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">
                  Confirm new password
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="mt-1 w-full border border-gray-200 bg-gray-50/50 px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-[#3b82f6] focus:outline-none"
                  placeholder="Re-enter new password"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-[#3b82f6] py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#2563eb]"
                >
                  Update password
                </button>
                <button
                  type="button"
                  onClick={() => setAccountExpanded(false)}
                  className="border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-600 transition-colors hover:border-[#3b82f6]/40 hover:bg-[#3b82f6]/5 hover:text-[#3b82f6]"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {toast && (
        <div
          className="fixed bottom-6 left-1/2 z-[60] -translate-x-1/2 px-5 py-2.5 text-sm font-medium text-white shadow-lg"
          style={{
            background: toast.type === "success" ? "#22c55e" : "#ef4444",
          }}
        >
          {toast.msg}
        </div>
      )}
    </>
  );
}
