"use client";

import { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import AuthPageLayout from "@/components/onboarding/AuthPageLayout";
import { useAuth } from "@/lib/auth-context";

const STEPS = [
  { label: "Sign up your account" },
  { label: "Set up your workspace" },
  { label: "Set up your profile" },
];

export default function RegisterPage() {
  const router = useRouter();
  const { user, onboardingComplete, register: doRegister, signInWithOAuth } = useAuth();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Redirect if already authenticated — go to dashboard, not onboarding
  useEffect(() => {
    if (!user) return;
    if (onboardingComplete) router.replace("/dashboard");
    else router.replace("/");
  }, [user, onboardingComplete, router]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setError(null);
      if (password.length < 8) {
        setError("Password must be at least 8 characters.");
        return;
      }
      setLoading(true);
      try {
        const name = [firstName.trim(), lastName.trim()].filter(Boolean).join(" ") || "User";
        await doRegister(name, email.trim(), password, {
          first_name: firstName.trim(),
          last_name: lastName.trim(),
        });
        router.replace("/");
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    },
    [firstName, lastName, email, password, doRegister, router]
  );

  const handleGoogle = useCallback(async () => {
    setError(null);
    try {
      await signInWithOAuth("google");
    } catch (err) {
      setError((err as Error).message);
    }
  }, [signInWithOAuth]);

  return (
    <AuthPageLayout
      title="Get Started with Us"
      subtitle="Complete these easy steps to register your account."
      steps={STEPS}
      activeStep={1}
    >
      <h2 className="text-2xl font-semibold tracking-tight text-white">
        Sign Up Account
      </h2>
      <p className="mt-1 text-sm text-[var(--text-secondary)]">
        Enter your personal data to create your account.
      </p>

      <div className="mt-8">
        <button
          type="button"
          onClick={handleGoogle}
          className="w-full border border-[var(--glass-border)] bg-white/[0.04] py-3 px-4 text-sm font-medium text-white rounded-none transition-colors hover:border-white/[0.12] hover:bg-white/[0.06]"
        >
          Google
        </button>
      </div>

      <div className="mt-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-white/[0.08]" />
        <span className="text-xs text-[var(--text-muted)]">Or</span>
        <div className="h-px flex-1 bg-white/[0.08]" />
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-[var(--text-secondary)]">
              First Name
            </label>
            <input
              type="text"
              placeholder="eg. John"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full border border-[var(--glass-border)] bg-white/[0.04] py-2.5 px-3 text-sm text-white placeholder-[var(--text-muted)] rounded-none focus:border-[#2b6cb0]/40 focus:outline-none"
              required
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-[var(--text-secondary)]">
              Last Name
            </label>
            <input
              type="text"
              placeholder="eg. Francisco"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full border border-[var(--glass-border)] bg-white/[0.04] py-2.5 px-3 text-sm text-white placeholder-[var(--text-muted)] rounded-none focus:border-[#2b6cb0]/40 focus:outline-none"
              required
            />
          </div>
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium text-[var(--text-secondary)]">
            Email
          </label>
          <input
            type="email"
            placeholder="eg. johnfrans@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-[var(--glass-border)] bg-white/[0.04] py-2.5 px-3 text-sm text-white placeholder-[var(--text-muted)] rounded-none focus:border-[#2b6cb0]/40 focus:outline-none"
            required
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium text-[var(--text-secondary)]">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-[var(--glass-border)] bg-white/[0.04] py-2.5 pl-3 pr-10 text-sm text-white placeholder-[var(--text-muted)] rounded-none focus:border-[#2b6cb0]/40 focus:outline-none"
              required
              minLength={8}
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-white"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          <p className="mt-1 text-xs text-[var(--text-muted)]">
            Must be at least 8 characters.
          </p>
        </div>
        {error && (
          <p className="text-sm text-[var(--danger)]">{error}</p>
        )}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-white py-3 text-sm font-medium text-[var(--bg-primary)] rounded-none transition-colors hover:bg-white/90 disabled:opacity-50"
        >
          {loading ? "Signing up…" : "Sign Up"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-[var(--text-secondary)]">
        Already have an account?{" "}
        <Link href="/onboarding/login" className="font-medium text-white hover:underline">
          Login
        </Link>
      </p>
    </AuthPageLayout>
  );
}
