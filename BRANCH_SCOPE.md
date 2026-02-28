# Branch: frontend-app (FE role)

## PRD scope
Build the Next.js single-page demo: goal input → Generate Path → path display → Claim Badge → Notifs.

## Primary tasks
- Goal input field + Generate Path button
- Items list (from /api/retrieve) with explainability tooltips (similarity, recency_score)
- Path display: 3 steps (Read/Watch/Practice) with TLDRs and time estimates
- Start / Complete / Claim Badge buttons
- Notifs panel: log events, display simulated l2_anchor_tx
- Wire audio playback for MiniMax clip or fallback MP3
- Record fallback video (60s) of full flow

## API usage
- POST /api/retrieve — get top items for goal
- POST /api/generate_path — get 3-step path
- POST /api/claim_badge — claim signed badge

## Types
Import from `@/lib/types`: RetrieveResponse, GeneratePathResponse, ClaimBadgeResponse, PathStep, Badge.

## Fallbacks
- If backend down: display canned path from ai/canned_outputs.json
- If MiniMax audio unavailable: play fallback MP3
