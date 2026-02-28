import Link from "next/link";
import TopBar from "@/components/layout/TopBar";
import {
  BookOpen,
  Award,
  Newspaper,
  ArrowRight,
  User,
} from "lucide-react";

export default function AboutPage() {
  return (
    <>
      <TopBar />
      <main className="min-h-screen">
        {/* Hero */}
        <section className="relative mx-auto max-w-[1100px] px-6 py-20 md:px-8 md:py-28">
          <h1 className="text-center text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl">
            Learn. Earn. Certify.
          </h1>
          <p className="mx-auto mt-8 max-w-2xl text-center text-base text-[#a8a29e] md:text-lg">
            BadgeForge is an AI-powered crypto learning platform. Start as a
            guest or sign in with Google or Apple—your preferences sync across
            devices. Learn at your pace, earn verifiable badges, and stay ahead
            with live crypto news.
          </p>
          <div className="mt-10 flex justify-center">
            <Link
              href="/onboarding"
              className="inline-flex items-center gap-2 rounded-lg bg-[#3b82f6] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#2563eb]"
            >
              <User className="h-4 w-4" />
              Get Started
            </Link>
          </div>
        </section>

        {/* Stats / Features */}
        <section className="border-t border-white/[0.06] bg-white/[0.02]">
          <div className="mx-auto max-w-[1100px] px-6 py-16 md:px-8 md:py-20">
            <div className="grid gap-8 md:grid-cols-3">
              <div className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg border border-white/[0.08] bg-[#3b82f6]/10">
                  <Newspaper className="h-6 w-6 text-[#3b82f6]" />
                </div>
                <p className="mt-4 text-3xl font-bold tracking-tight text-white md:text-4xl">
                  4
                </p>
                <p className="mt-2 text-sm text-[#a8a29e]">
                  News sources—NewsAPI, CryptoCompare, CoinGecko & Market Movers
                </p>
              </div>
              <div className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg border border-white/[0.08] bg-[#3b82f6]/10">
                  <Award className="h-6 w-6 text-[#3b82f6]" />
                </div>
                <p className="mt-4 text-3xl font-bold tracking-tight text-white md:text-4xl">
                  Verifiable
                </p>
                <p className="mt-2 text-sm text-[#a8a29e]">
                  Badges you can claim, verify, and showcase
                </p>
              </div>
              <div className="text-center">
                <h3 className="text-lg font-semibold text-white">
                  Your journey, your way.
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-[#a8a29e]">
                  Pick your profile (learner, educator, or institution), choose up
                  to 3 interests, and set your experience level. We curate
                  everything around you.
                </p>
                <Link
                  href="/onboarding"
                  className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#3b82f6] hover:underline"
                >
                  Set your preferences
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Introducing */}
        <section className="relative mx-auto max-w-[1100px] px-6 py-20 md:px-8 md:py-24">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-xl">
              <h2 className="text-2xl font-bold tracking-tight text-white md:text-3xl">
                What We Built
              </h2>
              <p className="mt-2 text-base text-[#a8a29e]">
                A platform{" "}
                <span className="font-semibold text-white">
                  that adapts to how you learn
                </span>
              </p>
              <p className="mt-6 max-w-lg text-sm leading-relaxed text-[#a8a29e]">
                <strong className="text-white">Onboarding:</strong> A 5-step flow
                (Welcome, Profile, Interests, Experience, Summary). Guest users
                get preferences cached locally; signed-in users get them saved to
                Supabase and synced across devices.
              </p>
              <p className="mt-4 max-w-lg text-sm leading-relaxed text-[#a8a29e]">
                <strong className="text-white">News:</strong> Aggregated crypto
                news from four sources with date filters (Today, 3 days, 5 days
                ago). Full-article support for CryptoCompare, editorial-style
                cards, and Show more pagination.
              </p>
              <p className="mt-4 max-w-lg text-sm leading-relaxed text-[#a8a29e]">
                <strong className="text-white">Tutorials & Badges:</strong> AI-generated
                learning paths and verifiable credentials you can claim and
                prove.
              </p>
              <Link
                href="/news"
                className="mt-6 inline-flex items-center gap-2 rounded-lg border border-white/[0.12] bg-white/[0.03] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-white/[0.06]"
              >
                Explore News
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="relative h-48 w-full max-w-md overflow-hidden rounded-lg border border-white/[0.06] bg-white/[0.02] lg:h-56 lg:w-80">
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)`,
                  backgroundSize: "24px 24px",
                }}
              />
            </div>
          </div>
        </section>

        {/* Bottom */}
        <section className="border-t border-white/[0.06] bg-white/[0.02]">
          <div className="mx-auto max-w-[1100px] px-6 py-16 md:px-8 md:py-20">
            <div className="grid gap-8 md:grid-cols-2 md:items-center">
              <h2 className="text-xl font-bold leading-tight text-white md:text-2xl">
                From onboarding to news to badges—everything you need to learn
                crypto, in one place.
              </h2>
              <p className="text-sm leading-relaxed text-[#a8a29e] md:text-right">
                Sign in with Google or Apple, or continue as a guest. Your
                preferences follow you. Our news feed keeps you informed;
                our tutorials and badges help you prove what you&apos;ve learned.
              </p>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
