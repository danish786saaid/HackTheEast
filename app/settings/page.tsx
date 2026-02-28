"use client";

import { useState, useEffect } from "react";
import {
  Link2,
  ChevronDown,
  Camera,
  Lock,
  LogOut,
  GraduationCap,
  Presentation,
  Building2,
  Sprout,
  Flame,
  Zap,
  Pencil,
  Layers,
  BarChart3,
  UserCircle2,
  Eye,
  EyeOff,
  X,
  Globe,
  Bell,
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
  const [preferencesExpanded, setPreferencesExpanded] = useState(false);
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
    setInterests(prefs.interests);
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
    setInterests((prev) =>
      prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic],
    );
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

  const handleSavePreferences = () => {
    if (interests.length === 0) {
      showToast("error", "Select at least one topic.");
      return;
    }
    saveUserPreferences({ role, interests, level });
    showToast("success", "Preferences saved.");
    setPreferencesExpanded(false);
  };

  const roleLabel = ROLES.find((r) => r.id === role)?.label ?? role;
  const levelLabel = LEVELS.find((l) => l.id === level)?.label ?? level;

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
      className={`relative h-5 w-9 shrink-0 rounded-full transition-colors disabled:opacity-50 ${
        value ? "bg-[#3b82f6]" : "bg-gray-300"
      }`}
    >
      <span
        className={`absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${
          value ? "translate-x-4" : "translate-x-0"
        }`}
      />
    </button>
  );

  return (
    <>
      <TopBar />
      <div
        className="min-h-[calc(100vh-56px)] w-full bg-zinc-900 px-4 py-6 sm:px-6 sm:py-8"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(59,130,246,0.07) 0%, transparent 60%)",
        }}
      >
        <div className="mx-auto w-full max-w-5xl">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-100 tracking-tight">
              Settings
            </h1>
            <p className="mt-1 text-sm text-gray-400">
              Manage your account, preferences, and integrations.
            </p>
          </div>

          {/* ── Bento Grid ── */}
          <div className="grid grid-cols-4 gap-3 auto-rows-min">
            {/* ── Profile — 2 cols, 2 rows ── */}
            <div className="col-span-2 row-span-2 bg-white p-5 flex flex-col transition-transform duration-200 hover:scale-[1.02]">
              <form onSubmit={handleSaveProfile} className="flex flex-col flex-1">
                <div className="flex items-start gap-4">
                  <button
                    type="button"
                    onClick={handleAvatarClick}
                    className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#3b82f6] text-xl font-bold text-white"
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
                    <span className="absolute bottom-0 right-0 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-white">
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

                {/* Profile details */}
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
                      {new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                    </p>
                  </div>
                </div>

                {user && (
                  <button
                    type="submit"
                    className="mt-auto w-full bg-[#3b82f6] py-2.5 text-sm font-semibold text-white hover:bg-[#2563eb] transition-colors"
                  >
                    Save profile
                  </button>
                )}
              </form>

              {/* Change password button */}
              <button
                type="button"
                onClick={() => setAccountExpanded(true)}
                className="flex w-full items-center gap-2 border-t border-gray-200 px-0 pt-4 mt-4 text-left"
              >
                <Lock className="h-3.5 w-3.5 text-gray-400" />
                <span className="text-sm font-medium text-gray-700">
                  Change password
                </span>
              </button>
            </div>

            {/* ── Role & Level ── */}
            <div className="col-span-2 bg-white p-5 transition-transform duration-200 hover:scale-[1.02]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <UserCircle2 className="h-4 w-4 text-gray-400" />
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">
                    Your Role
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setPreferencesExpanded(true)}
                  className="flex items-center gap-1 text-xs font-medium text-[#3b82f6] hover:text-blue-400 transition-colors"
                >
                  <Pencil className="h-3 w-3" />
                  Edit
                </button>
              </div>
              <p className="mt-3 text-3xl font-bold text-gray-900">{roleLabel}</p>
              <div className="mt-4 flex items-center gap-6 border-t border-gray-200 pt-4">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">
                    Level
                  </p>
                  <p className="mt-1 text-xl font-bold text-gray-900">
                    {levelLabel}
                  </p>
                </div>
                <div className="border-l border-gray-200 pl-6">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">
                    Topics
                  </p>
                  <p className="mt-1 text-xl font-bold text-gray-900">
                    {interests.length}
                  </p>
                </div>
              </div>
            </div>

            {/* ── Notifications ── */}
            <div className="col-span-2 bg-white p-5 transition-transform duration-200 hover:scale-[1.02]">
              <div className="flex items-center gap-2 mb-4">
                <Bell className="h-4 w-4 text-gray-400" />
                <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">
                  Notifications
                </p>
              </div>
              <div className="space-y-3">
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
                    className="flex items-center justify-between"
                  >
                    <span className="text-sm text-gray-700">{label}</span>
                    <Toggle value={value} onToggle={() => set((v) => !v)} />
                  </div>
                ))}
              </div>
            </div>

            {/* ── Language ── */}
            <div className="col-span-2 bg-white p-5 transition-transform duration-200 hover:scale-[1.02]">
              <div className="flex items-center gap-2 mb-3">
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
                    className="bg-zinc-900 text-white"
                  >
                    {o.label}
                  </option>
                ))}
              </select>
            </div>

            {/* ── Integrations ── */}
            <div className="col-span-2 bg-white p-5 transition-transform duration-200 hover:scale-[1.02]">
              <div className="flex items-center gap-2 mb-4">
                <Link2 className="h-4 w-4 text-gray-400" />
                <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">
                  Integrations
                </p>
              </div>
              <div className="space-y-3">
                {["Google", "GitHub"].map((label) => (
                  <div
                    key={label}
                    className="flex items-center justify-between"
                  >
                    <span className="text-sm text-gray-700">{label}</span>
                    <button className="text-xs font-medium text-[#3b82f6] hover:text-blue-400 transition-colors">
                      Connect
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Log out ── */}
            <div className="col-span-4 transition-transform duration-200 hover:scale-[1.01]">
              <button
                type="button"
                onClick={() => {
                  logout();
                  window.location.href = "/onboarding";
                }}
                className="flex w-full items-center justify-center gap-2 bg-white py-3 text-sm font-medium text-gray-400 hover:bg-[#3b82f6] hover:text-white transition-all"
              >
                <LogOut className="h-3.5 w-3.5" />
                Log out
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Preferences Modal ── */}
      {preferencesExpanded && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-2xl max-h-[85vh] overflow-y-auto bg-zinc-800 shadow-2xl">
            {/* Modal header */}
            <div className="sticky top-0 z-10 flex items-center justify-between bg-zinc-800 border-b border-zinc-700 px-6 py-4">
              <h2 className="text-lg font-bold text-white">
                Edit Preferences
              </h2>
              <button
                type="button"
                onClick={() => setPreferencesExpanded(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="px-6 py-5 space-y-6">
              {/* Role */}
              <div>
                <h3 className="text-sm font-semibold text-white">
                  How you use BadgeForge
                </h3>
                <p className="mt-1 text-xs text-gray-400">
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
                        className={`flex w-full items-start gap-3 border p-3 text-left transition-colors ${
                          isSelected
                            ? "border-[#3b82f6] bg-[#3b82f6]/10"
                            : "border-zinc-700 hover:border-zinc-600"
                        }`}
                      >
                        <Icon
                          className={`mt-0.5 h-4 w-4 shrink-0 ${isSelected ? "text-[#3b82f6]" : "text-gray-400"}`}
                        />
                        <div>
                          <p
                            className={`text-sm font-medium ${isSelected ? "text-[#3b82f6]" : "text-gray-700"}`}
                          >
                            {r.label}
                          </p>
                          <p className="mt-0.5 text-[11px] text-gray-400">
                            {r.description}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Topics */}
              <div>
                <h3 className="text-sm font-semibold text-white">
                  Topics of interest
                </h3>
                <p className="mt-1 text-xs text-gray-400">
                  Select at least one. We use these to curate your content feed
                  and learning paths.
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {TOPICS.map((topic) => {
                    const isSelected = interests.includes(topic);
                    return (
                      <button
                        key={topic}
                        type="button"
                        onClick={() => toggleInterest(topic)}
                        className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                          isSelected
                            ? "bg-[#3b82f6] text-white"
                            : "border border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-zinc-200"
                        }`}
                      >
                        {topic}
                      </button>
                    );
                  })}
                </div>
                {interests.length === 0 && (
                  <p className="mt-2 text-[11px] text-amber-400">
                    Select at least one topic.
                  </p>
                )}
              </div>

              {/* Level */}
              <div>
                <h3 className="text-sm font-semibold text-white">
                  Experience level
                </h3>
                <p className="mt-1 text-xs text-gray-400">
                  We&apos;ll adapt the depth and complexity of your learning
                  paths.
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
                        className={`flex w-full items-start gap-3 border p-3 text-left transition-colors ${
                          isSelected
                            ? "border-[#3b82f6] bg-[#3b82f6]/10"
                            : "border-zinc-700 hover:border-zinc-600"
                        }`}
                      >
                        <Icon
                          className={`mt-0.5 h-4 w-4 shrink-0 ${isSelected ? "text-[#3b82f6]" : "text-gray-400"}`}
                        />
                        <div>
                          <p
                            className={`text-sm font-medium ${isSelected ? "text-[#3b82f6]" : "text-gray-700"}`}
                          >
                            {l.label}
                          </p>
                          <p className="mt-0.5 text-[11px] text-gray-400">
                            {l.description}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Modal footer */}
            <div className="sticky bottom-0 flex gap-3 border-t border-zinc-700 bg-zinc-800 px-6 py-4">
              <button
                type="button"
                onClick={handleSavePreferences}
                className="flex-1 bg-[#3b82f6] py-2.5 text-sm font-semibold text-white hover:bg-[#2563eb] transition-colors"
              >
                Save preferences
              </button>
              <button
                type="button"
                onClick={() => setPreferencesExpanded(false)}
                className="border border-zinc-700 px-5 py-2.5 text-sm font-semibold text-zinc-400 hover:bg-zinc-700 hover:text-white transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Change Password Modal ── */}
      {accountExpanded && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md max-h-[85vh] overflow-y-auto bg-zinc-800 shadow-2xl">
            {/* Modal header */}
            <div className="sticky top-0 z-10 flex items-center justify-between bg-zinc-800 border-b border-zinc-700 px-6 py-4">
              <h2 className="text-lg font-bold text-white">Change Password</h2>
              <button
                type="button"
                onClick={() => setAccountExpanded(false)}
                className="text-zinc-500 hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleChangePassword} className="px-6 py-5 space-y-4">
              <div>
                <label className="text-xs text-zinc-500">
                  Current password
                </label>
                <div className="relative mt-1">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    className="w-full border border-zinc-700 bg-zinc-800 px-3 py-2.5 pr-9 text-sm text-white placeholder-zinc-500 focus:border-[#3b82f6] focus:outline-none"
                    placeholder="Enter current password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
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
                <label className="text-xs text-zinc-500">
                  New password
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="mt-1 w-full border border-zinc-700 bg-zinc-800 px-3 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-[#3b82f6] focus:outline-none"
                  placeholder="Min 8 characters"
                />
              </div>
              <div>
                <label className="text-xs text-zinc-500">
                  Confirm new password
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="mt-1 w-full border border-zinc-700 bg-zinc-800 px-3 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-[#3b82f6] focus:outline-none"
                  placeholder="Re-enter new password"
                />
              </div>
            </form>

            {/* Modal footer */}
            <div className="sticky bottom-0 flex gap-3 border-t border-zinc-700 bg-zinc-800 px-6 py-4">
              <button
                type="button"
                onClick={(e) => { e.preventDefault(); handleChangePassword(e as unknown as React.FormEvent); }}
                className="flex-1 bg-[#3b82f6] py-2.5 text-sm font-semibold text-white hover:bg-[#2563eb] transition-colors"
              >
                Update password
              </button>
              <button
                type="button"
                onClick={() => setAccountExpanded(false)}
                className="border border-zinc-700 px-5 py-2.5 text-sm font-semibold text-zinc-400 hover:bg-zinc-700 hover:text-white transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
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
