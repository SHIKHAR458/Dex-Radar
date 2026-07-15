import getDexTokens from "../services/dexService.js";
import normalizeToken from "../services/normalizeToken.js";
import redisClient from "../config/redis.js";

const REDIS_KEY = "tokens";
const PREVIOUS_KEY = "tokens:previous";
const PRICE_THRESHOLD = 1;
const VOLUME_THRESHOLD = 20;

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
      const previousRaw = await redisClient.get(PREVIOUS_KEY);
      const previousTokens = previousRaw ? JSON.parse(previousRaw) : [];
      const previousMap = new Map(previousTokens.map((token) => [token.id, token]));

      const changedTokens = tokens.filter((token) =>
        hasMeaningfulChange(previousMap.get(token.id), token)
      );

      await redisClient.set(REDIS_KEY, JSON.stringify(tokens));
      await redisClient.set(PREVIOUS_KEY, JSON.stringify(tokens));

      if (io && changedTokens.length > 0) {
        io.emit("tokens:update", {
          updatedAt: new Date().toISOString(),
          tokens: changedTokens,
        });
      }

      console.log(`Redis updated. Changed tokens: ${changedTokens.length}`);
    } catch (err) {
      console.error(err);
    }
  };

  poll();

  setInterval(poll, 4000);
};
