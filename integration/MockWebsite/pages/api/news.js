import axios from "axios";

const DEFAULT_QUERY =
  "crypto AND (bitcoin OR ethereum OR blockchain OR DeFi OR NFT OR web3 OR cryptocurrency OR token OR altcoin)";

const CRYPTO_KEYWORDS = [
  "crypto", "bitcoin", "btc", "ethereum", "eth", "blockchain",
  "defi", "nft", "web3", "token", "altcoin", "solana", "ripple",
  "xrp", "binance", "coinbase", "stablecoin", "mining", "wallet",
  "ledger", "exchange", "dex", "dao", "airdrop", "halving",
  "cryptocurrency", "digital asset", "smart contract", "layer 2",
];

function isCryptoRelevant(text) {
  const lower = text.toLowerCase();
  return CRYPTO_KEYWORDS.some((kw) => lower.includes(kw));
}

async function fetchNewsAPI(apiKey, from, to, page = 1) {
  try {
    const params = {
      q: DEFAULT_QUERY,
      sortBy: "publishedAt",
      pageSize: 30,
      page,
      language: "en",
      apiKey,
    };
    if (from) params.from = from;
    if (to) params.to = to;

    const { data } = await axios.get("https://newsapi.org/v2/everything", { params });
    return (data.articles || [])
      .filter((a) => a.title && a.title !== "[Removed]" && isCryptoRelevant(`${a.title} ${a.description || ""}`))
      .map((a) => ({
        title: a.title,
        description: a.description,
        url: a.url,
        image: a.urlToImage,
        source: a.source?.name || "NewsAPI",
        publishedAt: a.publishedAt,
        author: a.author,
        content: a.content,
        provider: "NewsAPI",
      }));
  } catch (err) {
    console.error("[NewsAPI]", err.message);
    return [];
  }
}

const MACRO_QUERY =
  '(Trump OR "Federal Reserve" OR "interest rate" OR tariff OR sanctions OR war OR geopolitical OR "SEC crypto" OR "executive order" OR inflation OR recession) AND (market OR economy OR stocks OR bitcoin OR crypto OR "Wall Street")';

const MACRO_KEYWORDS = [
  "trump", "biden", "fed", "federal reserve", "interest rate", "tariff",
  "sanctions", "war", "iran", "china", "russia", "ukraine", "nato",
  "sec", "regulation", "executive order", "inflation", "recession",
  "gdp", "treasury", "bond", "dollar", "stimulus", "congress",
  "senate", "election", "geopolitical", "trade war", "oil",
  "opec", "crash", "rally", "sell-off", "black swan",
];

function isMacroRelevant(text) {
  const lower = text.toLowerCase();
  return MACRO_KEYWORDS.some((kw) => lower.includes(kw));
}

async function fetchMarketMovers(apiKey, from, to, page = 1) {
  if (!apiKey) return [];
  try {
    const params = {
      q: MACRO_QUERY,
      sortBy: "publishedAt",
      pageSize: 20,
      page,
      language: "en",
      apiKey,
    };
    if (from) params.from = from;
    if (to) params.to = to;

    const { data } = await axios.get("https://newsapi.org/v2/everything", { params });
    return (data.articles || [])
      .filter((a) => a.title && a.title !== "[Removed]" && isMacroRelevant(`${a.title} ${a.description || ""}`))
      .map((a) => ({
        title: a.title,
        description: a.description,
        url: a.url,
        image: a.urlToImage,
        source: a.source?.name || "NewsAPI",
        publishedAt: a.publishedAt,
        author: a.author,
        content: a.content,
        provider: "Market Movers",
      }));
  } catch (err) {
    console.error("[MarketMovers]", err.message);
    return [];
  }
}

async function fetchCryptoCompare(from, to, page = 1) {
  try {
    const params = { lang: "EN", limit: 30 };
    if (to) params.lTs = Math.floor(new Date(to + "T23:59:59Z").getTime() / 1000);
    if (page > 1) {
      const offset = (page - 1) * 30;
      const baseTs = params.lTs || Math.floor(Date.now() / 1000);
      params.lTs = baseTs - offset * 3600;
    }

    const { data } = await axios.get("https://min-api.cryptocompare.com/data/v2/news/", { params });
    const articles = (data.Data || [])
      .filter((a) => {
        if (!a.title) return false;
        if (from) {
          const pubDate = new Date(a.published_on * 1000);
          if (pubDate < new Date(from + "T00:00:00Z")) return false;
        }
        return true;
      })
      .map((a) => ({
        title: a.title,
        description: a.body ? a.body.slice(0, 300) + "..." : null,
        url: a.url,
        image: a.imageurl || null,
        source: a.source_info?.name || a.source || "CryptoCompare",
        publishedAt: new Date(a.published_on * 1000).toISOString(),
        author: null,
        content: a.body || null,
        provider: "CryptoCompare",
      }));
    return articles;
  } catch (err) {
    console.error("[CryptoCompare]", err.message);
    return [];
  }
}

async function fetchCoinGeckoNews(page = 1) {
  try {
    const { data } = await axios.get("https://api.coingecko.com/api/v3/news", {
      params: { per_page: 25, page },
    });
    return (data.data || []).map((a) => ({
      title: a.title,
      description: a.description || null,
      url: a.url,
      image: a.thumb_2x || a.thumb || null,
      source: a.news_site || "CoinGecko",
      publishedAt: a.updated_at || a.created_at || new Date().toISOString(),
      author: a.author || null,
      content: a.description || null,
      provider: "CoinGecko",
    }));
  } catch (err) {
    console.error("[CoinGecko]", err.message);
    return [];
  }
}

export default async function handler(req, res) {
  const apiKey = process.env.NEWSAPI_KEY;
  const from = req.query.from || undefined;
  const to = req.query.to || undefined;
  const page = parseInt(req.query.page, 10) || 1;

  const [newsApiArticles, cryptoCompareArticles, coinGeckoArticles, marketMoverArticles] = await Promise.all([
    apiKey ? fetchNewsAPI(apiKey, from, to, page) : Promise.resolve([]),
    fetchCryptoCompare(from, to, page),
    fetchCoinGeckoNews(page),
    fetchMarketMovers(apiKey, from, to, page),
  ]);

  const combined = [...newsApiArticles, ...cryptoCompareArticles, ...coinGeckoArticles, ...marketMoverArticles];

  const fromMs = from ? new Date(from + "T00:00:00Z").getTime() : null;
  const toMs = to ? new Date(to + "T23:59:59Z").getTime() : null;

  const BLOCKED_SOURCES = ["investing.com"];

  const seen = new Set();
  const unique = combined.filter((a) => {
    if (BLOCKED_SOURCES.some((b) => (a.source || "").toLowerCase().includes(b))) return false;
    if (a.publishedAt) {
      const pubMs = new Date(a.publishedAt).getTime();
      if (fromMs && pubMs < fromMs) return false;
      if (toMs && pubMs > toMs) return false;
    }
    const key = a.title.toLowerCase().replace(/\s+/g, " ").trim();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  unique.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

  const seenImages = new Set();
  const deduped = unique.map((a, i) => {
    let image = a.image;
    if (image) {
      if (seenImages.has(image)) {
        image = null;
      } else {
        seenImages.add(image);
      }
    }
    return { ...a, image, id: i };
  });

  return res.status(200).json({
    articles: deduped,
    page,
  });
}
