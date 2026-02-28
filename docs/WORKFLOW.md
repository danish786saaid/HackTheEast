# BadgeForge — Branch Workflow (PRD-aligned)

## Structure

```
main (stable, deployable)
  │
  └── integration (merge target for parent branches)
        │
        ├── frontend-app (parent)
        │     ├── frontend/dashboard
        │     ├── frontend/tutorials
        │     ├── frontend/news-illustrator
        │     └── frontend/onboarding
        │
        ├── backend-app (parent)
        │     ├── backend/exa-integration
        │     ├── backend/minimax-integration
        │     └── backend/content-pipeline
        │
        └── ai-ml (parent)
```

## Merge flow

1. **Sub-branches** merge into their **parent** (e.g. `frontend/dashboard` → `frontend-app`)
2. **Parent branches** merge into **`integration`** (e.g. `frontend-app` → `integration`)
3. When `integration` is stable, merge **`integration`** → **`main`**
4. Never merge sub-branches directly into `integration` or `main`

## Role assignments (4 people)

| Role | Parent branch | Sub-branches |
|------|---------------|--------------|
| **FE** | `frontend-app` | `frontend/dashboard`, `frontend/tutorials`, `frontend/news-illustrator`, `frontend/onboarding` |
| **BE** | `backend-app` | `backend/exa-integration`, `backend/minimax-integration`, `backend/content-pipeline` |
| **ML** | `ai-ml` | (single branch) |
| **PD** | — | Demo script, slides, fallback video, acceptance tests, final merge |

## Getting started

```bash
git checkout integration
git pull
git checkout frontend-app
git pull
git checkout -b frontend/dashboard   # or frontend/tutorials, etc.
# Work, commit, push
# Open PR into frontend-app (not integration)
```

When your parent has all sub-branches merged, open PR: `frontend-app` → `integration`.

## API contracts (on main)

All branches use these. Frontend calls them; backend implements.

- `POST /api/retrieve` — `{ user_goal, top_k }` → `{ items[] }`
- `POST /api/generate_path` — `{ user_goal, items }` → `{ goal, path[], rationale }`
- `POST /api/claim_badge` — `{ user_id, goal, path }` → `{ badge, signature, l2_anchor_tx }`
- `POST /api/verify_badge` — `{ badge, signature }` → `{ valid }`

Types: `lib/types.ts`  
Stubs: `lib/api-stubs.js` (backend replaces with real logic)
