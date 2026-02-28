"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import GlowWord from "../GlowWord";

type Props = {
  onNext: () => void;
};

function glowWords(text: string, dim = false) {
  return text.split(" ").map((word, i) => (
    <span key={i}>
      <GlowWord dim={dim}>{word}</GlowWord>
      {" "}
    </span>
  ));
}

export default function WelcomeStep({ onNext }: Props) {
  return (
    <div className="relative flex flex-col items-center">
      <div className="flex flex-col items-center text-center pt-20">
        {/* Badge */}
        <div className="group/badge mb-8 inline-flex items-center border border-white/[0.08] bg-white/[0.03] px-4 py-1.5 transition-all duration-300 hover:border-white/[0.16] hover:bg-white/[0.06] cursor-default">
          <span className="text-xs tracking-widest uppercase text-white/40 transition-all duration-300 group-hover/badge:text-white/70 group-hover/badge:[text-shadow:0_0_20px_rgba(255,255,255,0.4),0_0_40px_rgba(43,108,176,0.3)]">
            Powered by OAX Foundation
          </span>
        </div>

        <h1 className="max-w-[720px] text-5xl font-semibold leading-[1.1] tracking-tight text-white lg:text-6xl">
          AI-powered learning
          <br />
          <span className="text-white/50">for fast-moving fields</span>
        </h1>

        <p className="mt-6 max-w-lg text-lg leading-relaxed text-white/40">
          {glowWords("Intelligent curation, adaptive learning paths, and real-time content tracking — built so you never fall behind.", true)}
        </p>

        <button
          onClick={onNext}
          className="group mt-12 inline-flex items-center gap-3 border border-white/[0.12] bg-white/[0.04] px-8 py-4 text-sm font-medium tracking-wide text-white transition-all duration-300 hover:border-[#2b6cb0]/40 hover:bg-white/[0.06]"
          style={{ transition: "all 0.3s ease, box-shadow 0.3s ease" }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow =
              "0 0 30px rgba(43,108,176,0.2), 0 0 60px rgba(20,52,94,0.1)";
            e.currentTarget.style.textShadow =
              "0 0 15px rgba(255,255,255,0.3)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = "none";
            e.currentTarget.style.textShadow = "none";
          }}
        >
          Get started
          <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
        </button>

        <Link
          href="/onboarding/login"
          className="mt-4 inline-block text-sm font-medium text-white/60 transition-colors hover:text-white"
        >
          Login
        </Link>

        <p className="mt-6 text-xs text-white/20">
          Your preferences can be changed later in settings.
        </p>
      </div>
    </div>
  );
}
