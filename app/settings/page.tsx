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
  ArrowLeft,
  UserCircle2,
  Settings,
  Eye,
  EyeOff,
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
  const [toast, setToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  useEffect(() => {
    if (user) {
      setDisplayName(user.name);
    }
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
      prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic]
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

  return (
    <>
      <TopBar />
      <div className="settings-page flex min-h-[calc(100vh-56px)] w-full">
        <div className="mx-auto w-full max-w-2xl flex-1 overflow-y-auto px-6 py-10 sm:px-10">
          {/* Header */}
          <h1 className="text-[34px] font-bold leading-tight tracking-tight text-[#1a1a1a]">
            Settings
          </h1>
          <p className="mt-1.5 text-sm ds-muted">
            Manage your profile, security, and preferences.
          </p>

          {/* ─── Profile ─── */}
          <section className="mt-8">
            <h2 className="ds-section-title mb-3">Profile</h2>
            <div className="ds-card overflow-hidden">
              <form onSubmit={handleSaveProfile}>
                <div className="flex items-center gap-4 p-5">
                  <button
                    type="button"
                    onClick={handleAvatarClick}
                    className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#1a1a1a] text-lg font-bold text-white"
                  >
                    {avatarUrl ? (
                      <img src={avatarUrl} alt="" className="h-full w-full object-cover" />
                    ) : (
                      initialLetters
                    )}
                    <span className="absolute bottom-0 right-0 flex h-5 w-5 items-center justify-center rounded-full bg-[#e87461] text-white">
                      <Camera className="h-2.5 w-2.5" />
                    </span>
                  </button>
                  <div className="min-w-0 flex-1">
                    <label className="text-[10px] font-semibold uppercase tracking-widest ds-muted">
                      Display name
                    </label>
                    <input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      disabled={!user}
                      className="mt-1 w-full rounded-xl border border-[#e8e2d8] bg-[#faf7f2] px-3 py-2 text-sm font-medium text-[#1a1a1a] placeholder-[#b8b0a4] focus:border-[#1a1a1a] focus:outline-none focus:ring-1 focus:ring-[#1a1a1a]/10 disabled:opacity-50"
                      placeholder="Your name"
                    />
                    <p className="mt-1.5 text-xs ds-muted">{user?.email ?? "—"}</p>
                  </div>
                </div>
                {user && (
                  <div className="border-t border-[#e8e2d8] bg-[#faf7f2] px-5 py-3">
                    <button
                      type="submit"
                      className="ds-btn-primary w-full py-2.5 text-xs"
                    >
                      Save profile
                    </button>
                  </div>
                )}
              </form>

              {/* Account settings toggle */}
              <div className="border-t border-[#e8e2d8]">
                <button
                  type="button"
                  onClick={() => setAccountExpanded((v) => !v)}
                  className="flex w-full items-center justify-between px-5 py-4 text-left hover:bg-[#faf7f2] transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <Settings className="h-4 w-4 ds-muted" />
                    <span className="text-sm font-medium text-[#1a1a1a]">Account settings</span>
                  </div>
                  <ChevronDown
                    className={`h-4 w-4 ds-muted transition-transform ${accountExpanded ? "rotate-180" : ""}`}
                  />
                </button>

                {accountExpanded && (
                  <div className="border-t border-[#e8e2d8] px-5 py-5">
                    <form onSubmit={handleChangePassword}>
                      <div className="flex items-center gap-2 mb-4">
                        <Lock className="h-4 w-4 ds-muted" />
                        <h3 className="text-sm font-bold text-[#1a1a1a]">Change password</h3>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <label className="text-[10px] font-semibold uppercase tracking-widest ds-muted">
                            Current password
                          </label>
                          <div className="relative mt-1">
                            <input
                              type={showPassword ? "text" : "password"}
                              value={oldPassword}
                              onChange={(e) => setOldPassword(e.target.value)}
                              className="w-full rounded-xl border border-[#e8e2d8] bg-[#faf7f2] px-3 py-2 pr-10 text-sm text-[#1a1a1a] placeholder-[#b8b0a4] focus:border-[#1a1a1a] focus:outline-none focus:ring-1 focus:ring-[#1a1a1a]/10"
                              placeholder="Enter current password"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword((v) => !v)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 ds-muted hover:text-[#1a1a1a] transition-colors"
                            >
                              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                          </div>
                        </div>
                        <div>
                          <label className="text-[10px] font-semibold uppercase tracking-widest ds-muted">
                            New password
                          </label>
                          <input
                            type={showPassword ? "text" : "password"}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="mt-1 w-full rounded-xl border border-[#e8e2d8] bg-[#faf7f2] px-3 py-2 text-sm text-[#1a1a1a] placeholder-[#b8b0a4] focus:border-[#1a1a1a] focus:outline-none focus:ring-1 focus:ring-[#1a1a1a]/10"
                            placeholder="At least 8 characters"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-semibold uppercase tracking-widest ds-muted">
                            Confirm new password
                          </label>
                          <input
                            type={showPassword ? "text" : "password"}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="mt-1 w-full rounded-xl border border-[#e8e2d8] bg-[#faf7f2] px-3 py-2 text-sm text-[#1a1a1a] placeholder-[#b8b0a4] focus:border-[#1a1a1a] focus:outline-none focus:ring-1 focus:ring-[#1a1a1a]/10"
                            placeholder="Re-enter new password"
                          />
                        </div>
                      </div>
                      <button
                        type="submit"
                        className="ds-btn-primary mt-4 w-full py-2.5 text-xs"
                      >
                        Update password
                      </button>
                    </form>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* ─── Your preferences — summary or expanded ─── */}
          <section className="mt-8">
            <div className="flex items-center justify-between mb-3">
              <h2 className="ds-section-title">Your preferences</h2>
              {!preferencesExpanded && (
                <button
                  type="button"
                  onClick={() => setPreferencesExpanded(true)}
                  className="flex items-center gap-1.5 text-xs font-semibold text-[#e87461] hover:text-[#d4634f] transition-colors"
                >
                  <Pencil className="h-3 w-3" />
                  Change preferences
                </button>
              )}
            </div>
            <p className="mb-4 text-xs ds-muted">
              Set during signup. You can change these anytime.
            </p>

            {!preferencesExpanded ? (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="ds-card p-5">
                  <UserCircle2 className="h-5 w-5 ds-muted" />
                  <p className="mt-3 text-[10px] font-semibold uppercase tracking-widest ds-muted">
                    Profile
                  </p>
                  <p className="mt-1 text-sm font-bold text-[#1a1a1a]">{roleLabel}</p>
                </div>
                <div className="ds-card p-5">
                  <Layers className="h-5 w-5 ds-muted" />
                  <p className="mt-3 text-[10px] font-semibold uppercase tracking-widest ds-muted">
                    Interests
                  </p>
                  <p className="mt-1 text-sm font-bold text-[#1a1a1a]">
                    {interests.length > 0 ? `${interests.length} topic${interests.length === 1 ? "" : "s"}` : "None selected"}
                  </p>
                  {interests.length > 0 && (
                    <p className="mt-1 text-[11px] leading-snug ds-muted">
                      {interests.join(", ")}
                    </p>
                  )}
                </div>
                <div className="ds-card p-5">
                  <BarChart3 className="h-5 w-5 ds-muted" />
                  <p className="mt-3 text-[10px] font-semibold uppercase tracking-widest ds-muted">
                    Level
                  </p>
                  <p className="mt-1 text-sm font-bold text-[#1a1a1a]">{levelLabel}</p>
                </div>
              </div>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => setPreferencesExpanded(false)}
                  className="mb-5 flex items-center gap-1.5 text-xs font-medium ds-muted hover:text-[#1a1a1a] transition-colors"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  Back to summary
                </button>

                {/* Role */}
                <div className="ds-card p-5">
                  <h3 className="mb-1 text-sm font-bold text-[#1a1a1a]">How you use BadgeForge</h3>
                  <p className="mb-4 text-xs ds-muted">
                    We use this to tailor your experience.
                  </p>
                  <div className="grid grid-cols-1 gap-2">
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
                          className={`flex items-start gap-3 rounded-xl border p-3.5 text-left transition-all ${
                            isSelected
                              ? "border-[#1a1a1a] bg-[#1a1a1a] text-white"
                              : "border-[#e8e2d8] bg-white hover:border-[#d4cdc2] hover:bg-[#faf7f2]"
                          }`}
                        >
                          <Icon className={`mt-0.5 h-4 w-4 shrink-0 ${isSelected ? "text-white/70" : "ds-muted"}`} />
                          <div>
                            <p className={`text-sm font-semibold ${isSelected ? "text-white" : "text-[#1a1a1a]"}`}>{r.label}</p>
                            <p className={`mt-0.5 text-[11px] ${isSelected ? "text-white/60" : "ds-muted"}`}>{r.description}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Topics */}
                <div className="ds-card mt-4 p-5">
                  <h3 className="mb-1 text-sm font-bold text-[#1a1a1a]">Topics of interest</h3>
                  <p className="mb-4 text-xs ds-muted">
                    Select at least one. We use these to curate your content feed and learning paths.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {TOPICS.map((topic) => {
                      const isSelected = interests.includes(topic);
                      return (
                        <button
                          key={topic}
                          type="button"
                          onClick={() => toggleInterest(topic)}
                          className={`ds-chip px-3.5 py-2 ${isSelected ? "ds-chip-active" : ""}`}
                        >
                          {topic}
                        </button>
                      );
                    })}
                  </div>
                  {interests.length === 0 && (
                    <p className="mt-3 text-xs text-[#e87461]">Select at least one topic to save.</p>
                  )}
                </div>

                {/* Experience level */}
                <div className="ds-card mt-4 p-5">
                  <h3 className="mb-1 text-sm font-bold text-[#1a1a1a]">Experience level</h3>
                  <p className="mb-4 text-xs ds-muted">
                    We&apos;ll adapt the depth and complexity of your learning paths.
                  </p>
                  <div className="grid grid-cols-1 gap-2">
                    {LEVELS.map((l) => {
                      const Icon =
                        l.id === "beginner" ? Sprout : l.id === "intermediate" ? Flame : Zap;
                      const isSelected = level === l.id;
                      return (
                        <button
                          key={l.id}
                          type="button"
                          onClick={() => setLevel(l.id)}
                          className={`flex items-start gap-3 rounded-xl border p-3.5 text-left transition-all ${
                            isSelected
                              ? "border-[#1a1a1a] bg-[#1a1a1a] text-white"
                              : "border-[#e8e2d8] bg-white hover:border-[#d4cdc2] hover:bg-[#faf7f2]"
                          }`}
                        >
                          <Icon className={`mt-0.5 h-4 w-4 shrink-0 ${isSelected ? "text-white/70" : "ds-muted"}`} />
                          <div>
                            <p className={`text-sm font-semibold ${isSelected ? "text-white" : "text-[#1a1a1a]"}`}>{l.label}</p>
                            <p className={`mt-0.5 text-[11px] ${isSelected ? "text-white/60" : "ds-muted"}`}>{l.description}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Save + Done */}
                <div className="mt-5 flex gap-3">
                  <button
                    type="button"
                    onClick={handleSavePreferences}
                    className="ds-btn-primary flex-1 py-2.5 text-xs"
                  >
                    Save preferences
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreferencesExpanded(false)}
                    className="ds-btn-secondary px-5 py-2.5 text-xs"
                  >
                    Done
                  </button>
                </div>
              </>
            )}
          </section>

          {/* ─── Notifications ─── */}
          <section className="mt-8">
            <h2 className="ds-section-title mb-3">Notifications</h2>
            <div className="ds-card divide-y ds-divider overflow-hidden">
              {[
                { label: "Email", value: emailNotif, set: setEmailNotif },
                { label: "In-app", value: inAppNotif, set: setInAppNotif },
                { label: "Weekly digest", value: weeklyDigest, set: setWeeklyDigest },
              ].map(({ label, value, set }) => (
                <div key={label} className="flex items-center justify-between px-5 py-4">
                  <span className="text-sm font-medium text-[#1a1a1a]">{label}</span>
                  <button
                    type="button"
                    onClick={() => user && set((v) => !v)}
                    disabled={!user}
                    className={`ds-toggle h-6 w-10 disabled:opacity-50 ${value ? "ds-toggle-on" : ""}`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                        value ? "translate-x-4" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* ─── Preferences ─── */}
          <section className="mt-8">
            <h2 className="ds-section-title mb-3">Preferences</h2>
            <div className="ds-card overflow-hidden px-5 py-4">
              <label className="text-[10px] font-semibold uppercase tracking-widest ds-muted">
                Language
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="mt-1 w-full rounded-xl border border-[#e8e2d8] bg-[#faf7f2] px-3 py-2 text-sm font-medium text-[#1a1a1a] focus:border-[#1a1a1a] focus:outline-none"
              >
                {LANGUAGES.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
          </section>

          {/* ─── Integrations ─── */}
          <section className="mt-8">
            <h2 className="ds-section-title mb-3">Integrations</h2>
            <div className="ds-card divide-y ds-divider overflow-hidden">
              {["Google", "GitHub"].map((label) => (
                <div
                  key={label}
                  className="flex items-center justify-between px-5 py-4 hover:bg-[#faf7f2] transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <Link2 className="h-4 w-4 ds-muted" />
                    <span className="text-sm font-medium text-[#1a1a1a]">{label}</span>
                  </div>
                  <button className="ds-btn-secondary px-4 py-1.5 text-xs">
                    Connect
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* ─── Log out ─── */}
          <div className="mt-10 mb-12">
            <button
              type="button"
              onClick={() => {
                logout();
                window.location.href = "/onboarding";
              }}
              className="flex w-full items-center justify-center gap-2.5 rounded-full border border-[#e87461]/30 py-3 text-sm font-semibold text-[#e87461] transition-colors hover:bg-[#e87461] hover:text-white"
            >
              <LogOut className="h-4 w-4" />
              Log out
            </button>
          </div>
        </div>
      </div>

      {toast && (
        <div
          className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full px-5 py-2.5 text-sm font-semibold text-white shadow-lg"
          style={{
            background: toast.type === "success" ? "#1a1a1a" : "#e87461",
          }}
        >
          {toast.msg}
        </div>
      )}
    </>
  );
}
