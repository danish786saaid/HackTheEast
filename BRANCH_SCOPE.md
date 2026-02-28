# Branch: backend-app (BE role)

## PRD scope
Implement APIs, seed loader, badge signing, verification.

## Primary tasks
- /api/retrieve — replace stub with real embedding + ranking (or call ai/ items_with_embeddings)
- /api/generate_path — integrate MiniMax LLM; fallback to canned_outputs.json if LLM fails
- /api/claim_badge — HMAC SHA256 signing; return simulated l2_anchor_tx
- /api/verify_badge — HMAC verification
- scripts/seed.js — load items_with_embeddings.json into Supabase
- Unit tests for endpoints

## Badge signing (copy from PRD)
```js
const crypto = require('crypto');
function signBadge(badgeObj, secret) {
  const payload = JSON.stringify(badgeObj);
  return crypto.createHmac('sha256', secret).update(payload).digest('base64');
}
```
Use BADGE_SECRET from env.

## Fallbacks
- MiniMax fails → return canned output with use_canned=true
- Signing fails → return signature: "SIMULATED" (PD explains in demo)

## Key files
- pages/api/retrieve.js, generate_path.js, claim_badge.js, verify_badge.js
- lib/api-stubs.js — replace with real logic
- scripts/seed.js (create)
