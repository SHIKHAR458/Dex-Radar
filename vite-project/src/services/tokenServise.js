import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

export const getTokens = async ({ sortBy = "volume", timeframe = "24h", limit = 20 } = {}) => {
  const response = await api.get("/api/tokens", {
    params: {
      sortBy,
      timeframe,
      limit,
    },
  });

  return response.data;
};

export default api;
