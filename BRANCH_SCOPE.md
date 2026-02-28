# Branch: ai-ml (ML role)

## PRD scope
Curate seed content, compute embeddings, produce canned outputs, MiniMax integration.

## Primary tasks
- Curate seed/items.json (expand to ~50 items, GMAsia + high-quality sources)
- Compute embeddings → items_with_embeddings.json (or mock vectors)
- Tune ranking alpha for recency boost; provide explainability fields
- Finalize MiniMax prompt (see ai/prompt.txt)
- Produce 3 canned outputs for demo goals → ai/canned_outputs.json
- Attempt MiniMax audio generation; provide fallback MP3 + short video vignette script

## Deliverables
- ai/items_with_embeddings.json
- ai/canned_outputs.json
- ai/prompt.txt (done)
- ai/fallback.mp3 (or placeholder)
- ai/audio_script.txt (for fallback narration)

## Fallbacks
- Embedding service unavailable → simple keyword scoring as temporary retriever
- MiniMax audio fails → fallback MP3 + prewritten script

## Demo goals (for canned outputs)
1. "Understand LLM safety basics"
2. "Learn crypto regulation in Hong Kong"
3. "Get up to speed on AI ethics"
