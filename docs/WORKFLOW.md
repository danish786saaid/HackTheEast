# BadgeForge — Branch Workflow (PRD-aligned)

## Structure

```
main (stable, deployable)
  │
  └── integration (merge target)
        │
        ├── frontend/   — FE: UI, Notifs, audio playback, demo recording
        ├── backend/    — BE: APIs, seed loader, badge signing
        └── ai/        — ML: embeddings, canned outputs, MiniMax prompts
```

## Merge flow

1. **Feature branches** (`frontend/`, `backend/`, `ai/`) merge into **`integration`**
2. When `integration` is stable, merge **`integration`** → **`main`**
3. Never merge feature branches directly into `main`

## Role assignments (4 people)

| Role | Branch | Primary tasks |
|------|--------|---------------|
| **FE** | `frontend/` | Goal input, Generate Path button, path display, Claim Badge, Notifs panel, audio playback |
| **BE** | `backend/` | `/api/retrieve`, `/api/generate_path`, `/api/claim_badge`, `/api/verify_badge`, seed loader, HMAC signing |
| **ML** | `ai/` | `items_with_embeddings.json`, `canned_outputs.json`, MiniMax prompt, fallback MP3 |
| **PD** | — | Demo script, slides, fallback video, acceptance tests, final merge |

## API contracts (on main)

All branches use these. Frontend calls them; backend implements.

- `POST /api/retrieve` — `{ user_goal, top_k }` → `{ items[] }`
- `POST /api/generate_path` — `{ user_goal, items }` → `{ goal, path[], rationale }`
- `POST /api/claim_badge` — `{ user_id, goal, path }` → `{ badge, signature, l2_anchor_tx }`
- `POST /api/verify_badge` — `{ badge, signature }` → `{ valid }`

Types: `lib/types.ts`  
Stubs: `lib/api-stubs.js` (backend replaces with real logic)

## Getting started

```bash
git checkout integration
git pull
git checkout -b frontend/   # or backend/ or ai/
# Work, commit, push
# Open PR into integration
```
