const app = require("./app"); // the actual Express application
const http = require("http");
const config = require("./utils/config");
const logger = require("./utils/logger");
const createSocketIOServer = require("./socketserver");

const server = http.createServer(app);

/* Socket.IO Server */
createSocketIOServer(server);

server.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`);
});
