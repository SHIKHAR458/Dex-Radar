const toNumber = (value) => Number(value) || 0;

const normalizeToken = (rawData) => {
  const pairs = rawData?.pairs ?? [];
  const groupedTokens = new Map();

  for (const pair of pairs) {
    const baseToken = pair.baseToken ?? {};
    const tokenId = baseToken.address || pair.pairAddress;
    const candidate = {
      id: tokenId,
      pairAddress: pair.pairAddress ?? "",
      name: baseToken.name ?? baseToken.symbol ?? "Unknown",
      symbol: baseToken.symbol ?? "",
      chain: pair.chainId ?? "",
      dexId: pair.dexId ?? "",
      priceUsd: toNumber(pair.priceUsd),
      priceChange: {
        "24h": toNumber(pair.priceChange?.h24),
        "1h": toNumber(pair.priceChange?.h1),
        "6h": toNumber(pair.priceChange?.h6),
        "5m": toNumber(pair.priceChange?.m5),
      },
      volume: {
        "24h": toNumber(pair.volume?.h24),
        "1h": toNumber(pair.volume?.h1),
        "6h": toNumber(pair.volume?.h6),
        "5m": toNumber(pair.volume?.m5),
      },
      liquidity: toNumber(pair.liquidity?.usd),
      marketCap: toNumber(pair.marketCap ?? pair.fdv),
    };

    const existing = groupedTokens.get(tokenId);

    if (!existing) {
      groupedTokens.set(tokenId, candidate);
      continue;
    }

    const preferred = candidate.liquidity > existing.liquidity ? candidate : existing;

    groupedTokens.set(tokenId, {
      ...preferred,
      priceUsd: preferred.priceUsd || existing.priceUsd,
      priceChange: {
        "24h": preferred.priceChange["24h"] || existing.priceChange["24h"],
        "1h": preferred.priceChange["1h"] || existing.priceChange["1h"],
        "6h": preferred.priceChange["6h"] || existing.priceChange["6h"],
        "5m": preferred.priceChange["5m"] || existing.priceChange["5m"],
      },
      volume: {
        "24h": Math.max(existing.volume["24h"], candidate.volume["24h"]),
        "1h": Math.max(existing.volume["1h"], candidate.volume["1h"]),
        "6h": Math.max(existing.volume["6h"], candidate.volume["6h"]),
        "5m": Math.max(existing.volume["5m"], candidate.volume["5m"]),
      },
      liquidity: Math.max(existing.liquidity, candidate.liquidity),
      marketCap: Math.max(existing.marketCap, candidate.marketCap),
    });
  }

  return Array.from(groupedTokens.values());
};

export default normalizeToken;
