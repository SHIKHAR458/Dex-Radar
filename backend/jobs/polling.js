import getDexTokens from "../services/dexService.js";
import normalizeToken from "../services/normalizeToken.js";
import redisClient from "../config/redis.js";

const REDIS_KEY = "tokens";
const PRICE_THRESHOLD = 1;
const VOLUME_THRESHOLD = 20;
const ACTIVE_POLL_INTERVAL_MS = Number(process.env.POLL_INTERVAL_MS) || 15000;
const IDLE_POLL_INTERVAL_MS = Number(process.env.IDLE_POLL_INTERVAL_MS) || 300000;
const MAX_CACHE_AGE_MS = Number(process.env.MAX_CACHE_AGE_MS) || 60000;

let previousTokens = [];
let lastRedisWriteAt = 0;

const getPercentChange = (previousValue, nextValue) => {
  const prev = Number(previousValue) || 0;
  const next = Number(nextValue) || 0;

  if (prev === 0) {
    return next === 0 ? 0 : 100;
  }

  return (Math.abs(next - prev) / prev) * 100;
};

const hasMeaningfulChange = (previousToken, nextToken) => {
  if (!previousToken) {
    return true;
  }

  const priceChange = getPercentChange(previousToken.priceUsd, nextToken.priceUsd);
  const previousVolume = previousToken.volume?.["24h"];
  const nextVolume = nextToken.volume?.["24h"];
  const volumeChange = getPercentChange(previousVolume, nextVolume);

  return priceChange >= PRICE_THRESHOLD || volumeChange >= VOLUME_THRESHOLD;
};

export const startPolling = (io) => {
  const poll = async () => {
    try {
      const rawData = await getDexTokens();
      const tokens = normalizeToken(rawData);
      const previousMap = new Map(previousTokens.map((token) => [token.id, token]));

      const changedTokens = tokens.filter((token) =>
        hasMeaningfulChange(previousMap.get(token.id), token)
      );

      const shouldRefreshCache =
        changedTokens.length > 0 || Date.now() - lastRedisWriteAt >= MAX_CACHE_AGE_MS;

      if (shouldRefreshCache) {
        await redisClient.set(REDIS_KEY, JSON.stringify(tokens));
        lastRedisWriteAt = Date.now();
      }

      previousTokens = tokens;

      if (io && changedTokens.length > 0) {
        io.emit("tokens:update", {
          updatedAt: new Date().toISOString(),
          tokens: changedTokens,
        });
      }

      console.log(
        `Poll complete. Changed tokens: ${changedTokens.length}. Redis write: ${shouldRefreshCache}`
      );
    } catch (err) {
      console.error(err);
    } finally {
      const hasClients = (io?.engine?.clientsCount ?? 0) > 0;
      const nextInterval = hasClients ? ACTIVE_POLL_INTERVAL_MS : IDLE_POLL_INTERVAL_MS;

      setTimeout(poll, nextInterval);
    }
  };

  poll();
};
