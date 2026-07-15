import TokenRow from "../TokenRow/TokenRow.jsx";

function TokenTable({ tokens, loading, timeframe, onShowMore, showMoreEnabled }) {
  const rows = Array.isArray(tokens) ? tokens : [];

  return (
    <section className="rounded-3xl border border-emerald-500/10 bg-slate-900/60 p-6 text-slate-100 shadow-2xl shadow-emerald-950/10 backdrop-blur">
      <table className="w-full border-separate border-spacing-y-2">
        <thead>
          <tr className="text-left text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">
            <th className="px-4 py-3 rounded-l-3xl">Token</th>
            <th className="px-4 py-3">Price</th>
            <th className="px-4 py-3">Change ({timeframe})</th>
            <th className="px-4 py-3">Volume ({timeframe})</th>
            <th className="px-4 py-3">Liquidity</th>
            <th className="px-4 py-3 rounded-r-3xl">Market Cap</th>
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
          className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-5 py-2 text-sm font-semibold text-emerald-300 transition-colors hover:bg-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Show More
        </button>
      </div>
    </section>
  );
}

export default TokenTable;
