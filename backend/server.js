import http from "http";
import dotenv from "dotenv";
import app from "./app.js";
import { connectRedis } from "./config/redis.js";
import { startPolling } from "./jobs/polling.js";
import { initSocket } from "./socket.js";

dotenv.config();
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectRedis();

  const server = http.createServer(app);
  const io = initSocket(server);

  startPolling(io);

  server.listen(PORT, () => {
    console.log(`server is running at port http://localhost:${PORT}`);
  });
};

startServer();
