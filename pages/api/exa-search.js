/**
 * POST /api/exa-search
 * Proxies a semantic search query to the Exa AI API and returns results
 * with highlights, summaries, and image links.
 * Over-fetches and filters to prioritise results with real thumbnails.
 *
 * Body: { query: string, numResults?: number }
 * Returns: { results: ExaResult[] } or { error: string }
 */

const BAD_IMAGE_PATTERNS = [
  /\.svg(\?|$)/i,
  /logo/i,
  /favicon/i,
  /icon/i,
  /badge/i,
  /avatar/i,
  /placeholder/i,
  /1x1/i,
  /spacer/i,
  /blank\./i,
  /pixel\./i,
  /gravatar\.com/i,
];

function isRealThumbnail(url) {
  if (!url) return false;
  return !BAD_IMAGE_PATTERNS.some((re) => re.test(url));
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.EXA_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "EXA_API_KEY not configured" });
  }

  const { query, numResults = 6 } = req.body || {};

  if (!query || typeof query !== "string" || !query.trim()) {
    return res.status(400).json({ error: "query is required" });
  }

  const desired = Math.min(Math.max(1, Number(numResults)), 10);
  const overFetch = Math.min(desired * 3, 20);

  try {
    const response = await fetch("https://api.exa.ai/search", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `educational explanation of ${query.trim()}`,
        type: "auto",
        numResults: overFetch,
        includeDomains: [
          "arxiv.org",
          "wikipedia.org",
          "nature.com",
          "medium.com",
          "towardsdatascience.com",
          "freecodecamp.org",
          "dev.to",
          "hackernoon.com",
          "github.com",
          "investopedia.com",
          "coindesk.com",
          "wired.com",
          "technologyreview.com",
          "openai.com",
          "deepmind.com",
          "huggingface.co",
          "geeksforgeeks.org",
          "bbc.com",
          "reuters.com",
          "theguardian.com",
        ],
        contents: {
          text: { maxCharacters: 400 },
          highlights: { maxCharacters: 250 },
          extras: { imageLinks: 3 },
        },
      }),
    });

    if (!response.ok) {
      const errBody = await response.text();
      console.error("[/api/exa-search] Exa API error:", response.status, errBody);
      return res.status(502).json({ error: "Exa API request failed" });
    }

    const data = await response.json();

    const mapped = (data.results ?? []).map((r) => {
      const candidates = r.extras?.imageLinks ?? [];
      const goodImage = candidates.find(isRealThumbnail) ?? null;
      return {
        id: r.id ?? r.url,
        title: r.title ?? "Untitled",
        url: r.url,
        publishedDate: r.publishedDate ?? null,
        author: r.author ?? null,
        text: r.text ?? "",
        highlights: r.highlights ?? [],
        image: goodImage,
      };
    });

    const withImage = mapped.filter((r) => r.image);
    const withoutImage = mapped.filter((r) => !r.image);
    const results = [...withImage, ...withoutImage].slice(0, desired);

    return res.status(200).json({ results });
  } catch (e) {
    console.error("[/api/exa-search] Error:", e);
    return res.status(500).json({ error: e.message });
  }
}
