function getRelativeTime(lastUpdated) {
  if (!lastUpdated) return "--";

  const diffMs = Date.now() - new Date(lastUpdated).getTime();
  if (Number.isNaN(diffMs)) return "--";

  const diffSeconds = Math.floor(diffMs / 1000);
  if (diffSeconds < 5) return "just now";
  if (diffSeconds < 60) return `${diffSeconds}s ago`;

  const diffMinutes = Math.floor(diffSeconds / 60);
  if (diffMinutes < 60) return `${diffMinutes}m ago`;

  const diffHours = Math.floor(diffMinutes / 60);
  return `${diffHours}h ago`;
}

function Navbar({
  lastUpdated = null,
  apiLatency = null,
  socketStatus = "Connected",
}) {
  const formattedLastUpdated = getRelativeTime(lastUpdated);

  const formattedLatency = typeof apiLatency === "number" ? `${apiLatency}ms` : "--";
  const isConnected = socketStatus === "Connected";

  return (
    <nav className="border-b border-emerald-500/10 bg-slate-950/90 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.3em] text-emerald-400">
              Live Market Watch
            </p>
            <h1 className="mt-1 text-xl font-semibold tracking-tight text-slate-50 sm:text-2xl">
              Dex Radar
            </h1>
          </div>

          <div
            className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-sm ${
              isConnected
                ? "border border-emerald-500/20 bg-emerald-500/10 text-emerald-300"
                : "border border-rose-500/20 bg-rose-500/10 text-rose-300"
            }`}
          >
            <span
              className={`h-2 w-2 rounded-full ${
                isConnected ? "bg-emerald-400" : "bg-rose-400"
              }`}
            />
            WebSocket: {socketStatus}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-sm text-slate-300">
          <span className="rounded-full border border-slate-700 bg-slate-900 px-3 py-1.5">
            Last Updated: {formattedLastUpdated}
          </span>
          <span className="rounded-full border border-slate-700 bg-slate-900 px-3 py-1.5">
            API Latency: {formattedLatency}
          </span>
        </div>
      </div>
    </nav>
  )
}

export default Navbar;
