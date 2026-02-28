# BadgeForge: Exa → Filter → MiniMax — 6 rule pages

Use these when building or editing the content pipeline: **Exa search → filter & refine → user picks scenario + style → MiniMax generates content**.

| Page | File | Topic |
|------|------|--------|
| 1 | `01-scope-and-pipeline.mdc` | When rules apply; pipeline (content gen, not 3-step plan); input/output |
| 2 | `02-filtering.mdc` | Relevance, recency, domains, content type, dedupe, ordering, maxItems |
| 3 | `03-refinement.mdc` | Exa result → CuratedItem (title, url, type, description) |
| 4 | `04-prompts-and-scenarios.mdc` | Scenarios (summary, key points, catch up, etc.) + style (brain rot vs normal) |
| 5 | `05-validation-and-edge-cases.mdc` | Min items, empty Exa, malformed data, MiniMax errors, fallbacks |
| 6 | `06-explainability-and-logging.mdc` | Per-item scores, filter_stats, demo-safe messages |

**Globs:** Rules apply to `lib/content-pipeline/**`, `pages/api/**/retrieve*`, `pages/api/**/generate_path*`, `pages/api/**/exa*`, `pages/api/**/minimax*`.

**Related:** `lib/content-pipeline/` (types, filter-rules, prompt-builder, scenarios), `lib/content-pipeline/SCENARIOS.md`.
