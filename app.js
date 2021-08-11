const config = require("./utils/config");
const express = require("express");
require("express-async-errors");
const app = express();
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const upload = require("./utils/uploadFile");
const middleware = require("./utils/middleware");
const logger = require("./utils/logger");
const mongoose = require("mongoose");
const usersRouter = require("./routes/users");
const authRouter = require("./routes/auth");
const postsRouter = require("./routes/posts");
const conversationRouter = require("./routes/conversation");
const messageRouter = require("./routes/message");
const path = require("path");

logger.info("connecting to", config.MONGODB_URI);

mongoose
  .connect(config.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(() => {
    logger.info("connected to MongoDB");
  })
  .catch((error) => {
    logger.error("error connecting to MongoDB:", error.message);
  });

// when going to images path, go to directory images directory instead making a get request
app.use("/images", express.static(path.join(__dirname, "public/images")));

// middleware
app.use(cors());
app.use(express.static("build"));
app.use(express.json());
app.use(helmet());
app.use(morgan("tiny"));
app.use(middleware.tokenExtractor);

// upload image file
app.post("/api/upload", upload.single("file"), (req, res) => {
  try {
    return res.status(200).json("File uploded successfully");
  } catch (error) {
    console.error(error);
  }
});

// routes
app.use("/api/users", usersRouter);
app.use("/api/auth", authRouter);
app.use("/api/posts", postsRouter);
app.use("/api/conversations", conversationRouter);
app.use("/api/messages", messageRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
