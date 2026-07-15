function Toolbar({
  sortBy,
  setSortBy,
  timeframe,
  setTimeframe,
}) {
  return (
    <div className="flex flex-wrap items-center gap-3 rounded-3xl border border-emerald-500/10 bg-slate-900/70 px-4 py-3 shadow-2xl shadow-emerald-950/10 backdrop-blur">
      <select
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value)}
        className="rounded-full border border-slate-700 bg-slate-950 px-4 py-2 text-sm font-medium text-slate-200 outline-none"
      >
        <option value="volume">Volume</option>
        <option value="priceChange">Price Change 24h</option>
        <option value="marketCap">Market Cap</option>
      </select>

      <select
        value={timeframe}
        onChange={(e) => setTimeframe(e.target.value)}
        className="rounded-full border border-slate-700 bg-slate-950 px-4 py-2 text-sm font-medium text-slate-200 outline-none"
      >
        <option value="5m">5m</option>
        <option value="1h">1h</option>
        <option value="6h">6h</option>
        <option value="24h">24h</option>
      </select>

      <div className="flex items-center gap-2 rounded-full border border-slate-700 bg-slate-950 px-4 py-2 text-sm font-medium text-slate-200">
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
