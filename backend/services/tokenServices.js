import redisClient  from '../config/redis.js'

const ALLOWED_SORT_FIELDS = new Set([
  "priceUsd",
  "priceChange",
  "volume",
  "marketCap",
  "liquidity",
]);

const ALLOWED_TIMEFRAMES = new Set(["5m","1h", "6h", "24h"]);

const getAllTokens = async ({ sortBy = "volume", limit = 20, timeframe = "24h" } = {}) => {

  const cached = await redisClient.get("tokens");

  if (!cached) {
    return [];
  }

  const tokens = JSON.parse(cached);

  const safeSortBy = ALLOWED_SORT_FIELDS.has(sortBy) ? sortBy : "volume";
  const safeTimeframe = ALLOWED_TIMEFRAMES.has(timeframe) ? timeframe : "24h";
  const safeLimit = Number.isInteger(Number(limit)) ? Math.min(Math.max(1, Number(limit)), 300) : 20;

  const getSortValue = (token) => {
    if (safeSortBy === "priceUsd") return Number(token.priceUsd) || 0;
    if (safeSortBy === "marketCap") return Number(token.marketCap) || 0;
    if (safeSortBy === "liquidity") return Number(token.liquidity) || 0;

    if (safeSortBy === "priceChange") {
      return Number(token.priceChange?.[safeTimeframe]) || 0;
    }

    if (safeSortBy === "volume") {
      return Number(token.volume?.[safeTimeframe]) || 0;
    }

    return 0;
  };

  const sorted = [...tokens].sort((a, b) => getSortValue(b) - getSortValue(a));

  const finalData  =  sorted.slice(0, safeLimit);

  return finalData;
};

export default getAllTokens;
