const app = require("./app");
const mongoose = require("mongoose");
const logger = require("./app/utils/logger"); 

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;
const HOST = "192.168.165.239";

let server; 

async function startServer() {
  try {
    if (process.env.NODE_ENV !== "test") {
      if (!MONGO_URI) {
        throw new Error("MONGO_URI is not defined");
      }
      
      await mongoose.connect(MONGO_URI);
      logger.info("Connected to Database");
      server = app.listen(PORT, () => logger.info(`Server running on port http://${HOST}:${PORT}`));
    }
  } catch (error) {
    logger.error(`Cannot connect to Database: ${error.message}`);
    process.exit(1);
  }
}

if (process.env.NODE_ENV !== "test") {
  startServer();
}

process.on("SIGINT", () => {
  logger.warn("⚠️ Server dimatikan oleh pengguna");
  process.exit();
});

module.exports = { app, startServer, stopServer: () => server?.close() };
