import { useEffect, useState } from "react";
import Navbar from "../components/Navbar/Navbar.jsx";
import Toolbar from "../components/Toolbar/Toolbar.jsx";
import TokenTable from "../components/TokenTable/TokenTable.jsx";
import AlertPanel from "../components/AlterPanel/AlterPanel.jsx";
import { getTokens } from "../services/tokenServise.js";
import socket from "../services/socketServise.js";

function Dashboard() {
  const [tokenList, setTokenList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState(null);
  const [apiLatency, setApiLatency] = useState(null);
  const [socketStatus, setSocketStatus] = useState("Connecting");

  const [sortBy, setSortBy] = useState("volume");
  const [timeframe, setTimeframe] = useState("24h");
  const [visibleLimit, setVisibleLimit] = useState(20);
  const maxVisibleLimit = 300;
  const pageStep = 20;

  useEffect(() => {
    const fetchTokens = async () => {
      try {
        setLoading(true);
        setError("");

        const startedAt = performance.now();
        const response = await getTokens({ sortBy, timeframe, limit: visibleLimit });
        setApiLatency(Math.round(performance.now() - startedAt));

        if (response.success && Array.isArray(response.data)) {
          setTokenList(response.data);
          setLastUpdated(new Date().toISOString());
        } else {
          setTokenList([]);
        }
      } catch (err) {
        console.error("Error fetch tokens from backend", err);
        setError("Failed to load tokens");
        setTokenList([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTokens();
  }, [sortBy, timeframe, visibleLimit]);

  useEffect(() => {
    const handleTokenUpdate = ({ tokens: changedTokens } = {}) => {
      if (!Array.isArray(changedTokens) || changedTokens.length === 0) {
        return;
      }

      setTokenList((current) => {
        const map = new Map(current.map((token) => [token.id, token]));

        for (const updatedToken of changedTokens) {
          map.set(updatedToken.id, updatedToken);
        }

        return Array.from(map.values());
      });

      setLastUpdated(new Date().toISOString());
    };

    const handleConnect = () => setSocketStatus("Connected");
    const handleDisconnect = () => setSocketStatus("Disconnected");
    const handleConnectError = () => setSocketStatus("Disconnected");

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("connect_error", handleConnectError);
    socket.on("tokens:update", handleTokenUpdate);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("connect_error", handleConnectError);
      socket.off("tokens:update", handleTokenUpdate);
    };
  }, []);

  const handleShowMore = () => {
    setVisibleLimit((current) => Math.min(current + pageStep, maxVisibleLimit));
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.14),_transparent_28%),linear-gradient(180deg,#020617_0%,#0f172a_100%)] text-slate-50">
      <Navbar
        lastUpdated={lastUpdated}
        apiLatency={apiLatency}
        socketStatus={socketStatus}
      />
      <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6">
        <Toolbar
          sortBy={sortBy}
          setSortBy={setSortBy}
          timeframe={timeframe}
          setTimeframe={setTimeframe}
        />

        {error ? (
          <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-rose-200">
            {error}
          </div>
        ) : null}

        <div className="grid gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]">
          <TokenTable
            tokens={tokenList}
            loading={loading}
            timeframe={timeframe}
            onShowMore={handleShowMore}
            showMoreEnabled={visibleLimit < maxVisibleLimit}
          />
          <AlertPanel />
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
