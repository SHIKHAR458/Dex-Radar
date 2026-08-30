import TokenRow from "../TokenRow/TokenRow.jsx";
import { formatPrice, formatCompactNumber, formatVolume, formatLiquidity } from "../../utils/format";

function TokenCard({ token, timeframe }) {
  const changeValue = token.priceChange?.[timeframe];
  const volumeValue = token.volume?.[timeframe];
  const isPositiveOrZero = Number(changeValue) >= 0;
  const changeClassName = isPositiveOrZero
    ? "bg-emerald-500/15 text-emerald-300 ring-1 ring-inset ring-emerald-500/30"
    : "bg-rose-500/15 text-rose-300 ring-1 ring-inset ring-rose-500/30";

  return (
    <article className="rounded-lg border border-slate-800 bg-slate-950/70 p-4">
      <div className="flex min-w-0 items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="truncate text-base font-semibold text-slate-50">{token.name}</h2>
          <p className="mt-1 truncate text-xs font-normal uppercase tracking-[0.14em] text-slate-400">
            {token.symbol || "UNKNOWN"} {token.chain ? `- ${token.chain}` : ""}
          </p>
        </div>

        {changeValue != null ? (
          <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${changeClassName}`}>
            {Number(changeValue).toFixed(2)}%
          </span>
        ) : null}
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <div>
          <dt className="text-xs uppercase tracking-[0.12em] text-slate-500">Price</dt>
          <dd className="mt-1 font-medium text-slate-100">{formatPrice(token.priceUsd)}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-[0.12em] text-slate-500">Volume</dt>
          <dd className="mt-1 font-medium text-slate-100">{formatVolume(volumeValue)}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-[0.12em] text-slate-500">Liquidity</dt>
          <dd className="mt-1 font-medium text-slate-100">{formatLiquidity(token.liquidity)}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-[0.12em] text-slate-500">Market Cap</dt>
          <dd className="mt-1 font-medium text-slate-100">{formatCompactNumber(token.marketCap)}</dd>
        </div>
      </dl>
    </article>
  );
}

function TokenTable({ tokens, loading, timeframe, onShowMore, showMoreEnabled }) {
  const rows = Array.isArray(tokens) ? tokens : [];

  return (
    <section className="rounded-lg border border-emerald-500/10 bg-slate-900/60 p-3 text-slate-100 shadow-2xl shadow-emerald-950/10 backdrop-blur sm:p-4 lg:p-6">
      <div className="grid gap-3 md:hidden">
        {loading ? (
          <div className="rounded-lg border border-slate-800 bg-slate-950/70 px-4 py-6 text-sm text-slate-400">
            Loading tokens...
          </div>
        ) : (
          rows.map((token) => <TokenCard key={token.id} token={token} timeframe={timeframe} />)
        )}
      </div>

      <table className="hidden w-full border-separate border-spacing-y-2 md:table">
        <thead>
          <tr className="text-left text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">
            <th className="rounded-l-lg px-4 py-3">Token</th>
            <th className="px-4 py-3">Price</th>
            <th className="px-4 py-3">Change ({timeframe})</th>
            <th className="px-4 py-3">Volume ({timeframe})</th>
            <th className="px-4 py-3">Liquidity</th>
            <th className="rounded-r-lg px-4 py-3">Market Cap</th>
          </tr>
        </thead>

        <tbody>
          {loading ? (
            <tr>
              <td className="px-4 py-6 text-slate-400" colSpan={6}>
                Loading tokens...
              </td>
            </tr>
          ) : (
            rows.map((token) => <TokenRow key={token.id} token={token} timeframe={timeframe} />)
          )}
        </tbody>
      </table>

      <div className="mt-4 flex justify-center">
        <button
          type="button"
          onClick={onShowMore}
          disabled={!showMoreEnabled || loading}
          className="h-11 w-full rounded-full border border-emerald-500/20 bg-emerald-500/10 px-5 py-2 text-sm font-semibold text-emerald-300 transition-colors hover:bg-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto"
        >
          Show More
        </button>
      </div>
    </section>
  );
}

export default TokenTable;
