const usersRouter = require("express").Router();

usersRouter.get("/", (req, res) => {
  res.send("hey its user route");
});

module.exports = usersRouter;
