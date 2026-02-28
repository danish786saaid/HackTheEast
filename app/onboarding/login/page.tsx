"use client";

import { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import AuthPageLayout from "@/components/onboarding/AuthPageLayout";
import { useAuth } from "@/lib/auth-context";

const STEPS = [
  { label: "Sign in to your account" },
  { label: "Set up your workspace" },
  { label: "Set up your profile" },
];

export default function LoginPage() {
  const router = useRouter();
  const { user, onboardingComplete, login, signInWithOAuth } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (!user) return;
    if (onboardingComplete) router.replace("/");
    else router.replace("/onboarding");
  }, [user, onboardingComplete, router]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setError(null);
      setLoading(true);
      try {
        await login(email.trim(), password);
        if (onboardingComplete) router.replace("/");
        else router.replace("/onboarding");
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    },
    [email, password, login, onboardingComplete, router]
  );

  const handleGoogle = useCallback(async () => {
    setError(null);
    try {
      await signInWithOAuth("google");
    } catch (err) {
      setError((err as Error).message);
    }
  }, [signInWithOAuth]);

  const handleApple = useCallback(async () => {
    setError(null);
    try {
      await signInWithOAuth("apple");
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
        Login
      </h2>
      <p className="mt-1 text-sm text-[var(--text-secondary)]">
        Enter your credentials to access your account.
      </p>

      <div className="mt-8 flex gap-3">
        <button
          type="button"
          onClick={handleGoogle}
          className="flex-1 border border-[var(--glass-border)] bg-white/[0.04] py-3 px-4 text-sm font-medium text-white rounded-none transition-colors hover:border-white/[0.12] hover:bg-white/[0.06]"
        >
          Google
        </button>
        <button
          type="button"
          onClick={handleApple}
          className="flex-1 border border-[var(--glass-border)] bg-white/[0.04] py-3 px-4 text-sm font-medium text-white rounded-none transition-colors hover:border-white/[0.12] hover:bg-white/[0.06]"
        >
          Apple
        </button>
      </div>

      <div className="mt-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-white/[0.08]" />
        <span className="text-xs text-[var(--text-muted)]">Or</span>
        <div className="h-px flex-1 bg-white/[0.08]" />
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label className="mb-1.5 block text-xs font-medium text-[var(--text-secondary)]">
            Email
          </label>
          <input
            type="email"
            placeholder="eg. johnfrans@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-[var(--glass-border)] bg-white/[0.04] py-2.5 px-3 text-sm text-white placeholder-[var(--text-muted)] rounded-none focus:border-[var(--accent)]/40 focus:outline-none"
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
              className="w-full border border-[var(--glass-border)] bg-white/[0.04] py-2.5 pl-3 pr-10 text-sm text-white placeholder-[var(--text-muted)] rounded-none focus:border-[var(--accent)]/40 focus:outline-none"
              required
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
        </div>
        {error && (
          <p className="text-sm text-[var(--danger)]">{error}</p>
        )}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-white py-3 text-sm font-medium text-[var(--bg-primary)] rounded-none transition-colors hover:bg-white/90 disabled:opacity-50"
        >
          {loading ? "Signing in…" : "Login"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-[var(--text-secondary)]">
        Don&apos;t have an account?{" "}
        <Link href="/onboarding/register" className="font-medium text-white hover:underline">
          Sign up
        </Link>
      </p>
    </AuthPageLayout>
  );
}
