"use client";

import { useAuth } from "@/lib/auth-context";
import KpiCardsRow from "./KpiCardsRow";
import LearningTrendCard from "./LearningTrendCard";
import TopicDistributionCard from "./TopicDistributionCard";
import TrackingRulesCard from "./TrackingRulesCard";
import ContentFeedCard from "./ContentFeedCard";
import AlertsFeedCard from "./AlertsFeedCard";
import ActivityLogCard from "./ActivityLogCard";

export default function BentoMain() {
  const { user } = useAuth();
  const firstName = user?.name?.split(/\s+/)[0] ?? "there";

  return (
    <main className="mx-auto max-w-[1440px] px-8 pb-12 pt-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-white">Dashboard</h1>
        <p className="mt-1 text-sm text-[#78716c]">
          Welcome back, {firstName}. Here&apos;s your learning overview.
        </p>
      </div>

      <div className="bento-grid">
        {/* Row 1: KPI cards (full width) */}
        <div className="col-span-12">
          <KpiCardsRow />
        </div>

        {/* Row 2: Learning trend (8 col) + Topic distribution (4 col) */}
        <div className="col-span-8">
          <LearningTrendCard />
        </div>
        <div className="col-span-4">
          <TopicDistributionCard />
        </div>

        {/* Row 3: Content feed (8 col) + Alerts (4 col) */}
        <div className="col-span-8">
          <ContentFeedCard />
        </div>
        <div className="col-span-4">
          <AlertsFeedCard />
        </div>

        {/* Row 4: Tracking rules (7 col) + Activity log (5 col) */}
        <div className="col-span-7">
          <TrackingRulesCard />
        </div>
        <div className="col-span-5">
          <ActivityLogCard />
        </div>
      </div>
    </main>
  );
}
