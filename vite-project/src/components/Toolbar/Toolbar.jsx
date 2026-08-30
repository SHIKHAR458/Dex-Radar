function Toolbar({
  sortBy,
  setSortBy,
  timeframe,
  setTimeframe,
}) {
  return (
    <div className="grid gap-3 rounded-lg border border-emerald-500/10 bg-slate-900/70 px-3 py-3 shadow-2xl shadow-emerald-950/10 backdrop-blur sm:flex sm:flex-wrap sm:items-center sm:px-4">
      <select
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value)}
        className="h-11 w-full rounded-full border border-slate-700 bg-slate-950 px-4 py-2 text-sm font-medium text-slate-200 outline-none sm:w-auto"
      >
        <option value="volume">Volume</option>
        <option value="priceChange">Price Change 24h</option>
        <option value="marketCap">Market Cap</option>
      </select>

      <select
        value={timeframe}
        onChange={(e) => setTimeframe(e.target.value)}
        className="h-11 w-full rounded-full border border-slate-700 bg-slate-950 px-4 py-2 text-sm font-medium text-slate-200 outline-none sm:w-auto"
      >
        <option value="5m">5m</option>
        <option value="1h">1h</option>
        <option value="6h">6h</option>
        <option value="24h">24h</option>
      </select>

      <div className="flex h-11 w-full items-center justify-between gap-2 rounded-full border border-slate-700 bg-slate-950 px-4 py-2 text-sm font-medium text-slate-200 sm:w-auto sm:justify-start">
        <span>Auto Refresh</span>
        <span className="inline-flex items-center gap-1 text-emerald-400">
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
          On
        </span>
      </div>
    </div>
  );
}

export default Toolbar;
