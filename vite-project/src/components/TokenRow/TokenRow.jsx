import { formatPrice, formatCompactNumber, formatVolume, formatLiquidity } from "../../utils/format";

function TokenRow({ token, timeframe }) {
  const changeValue = token.priceChange?.[timeframe];
  const volumeValue = token.volume?.[timeframe];
  const isPositiveOrZero = Number(changeValue) >= 0;
  const changeClassName = isPositiveOrZero
    ? "bg-emerald-500/15 text-emerald-300 ring-1 ring-inset ring-emerald-500/30"
    : "bg-rose-500/15 text-rose-300 ring-1 ring-inset ring-rose-500/30";

  return (
    <tr className="bg-slate-900/80 hover:bg-slate-800/90 text-slate-100 transition-colors">
      <td className="px-4 py-3 font-medium text-slate-50 rounded-l-3xl">
        <div className="flex flex-col">
          <span>{token.name}</span>
          <span className="text-xs font-normal uppercase tracking-[0.16em] text-slate-400">
            {token.symbol || "UNKNOWN"} {token.chain ? `• ${token.chain}` : ""}
          </span>
        </div>
      </td>
      <td className="px-4 py-3">{formatPrice(token.priceUsd)}</td>
      <td className="px-4 py-3">
        {changeValue != null ? (
          <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${changeClassName}`}>
            {Number(changeValue).toFixed(2)}%
          </span>
        ) : (
          "-"
        )}
      </td>
      <td className="px-4 py-3">{formatVolume(volumeValue)}</td>
      <td className="px-4 py-3">{formatLiquidity(token.liquidity)}</td>
      <td className="px-4 py-3 rounded-r-3xl">{formatCompactNumber(token.marketCap)}</td>
    </tr>
  );
}

export default TokenRow;
