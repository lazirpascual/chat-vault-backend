const usersRouter = require("express").Router();

// update user
usersRouter.get("/", (req, res) => {
  res.send("hey its user route");
});

module.exports = usersRouter;
