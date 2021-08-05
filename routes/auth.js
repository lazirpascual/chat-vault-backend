const bcrypt = require("bcrypt");
const authRouter = require("express").Router();
const User = require("../models/User");

// REGISTER
authRouter.post("/register", async (req, res) => {
  // generate new password
  const saltRounds = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(req.body.password, saltRounds);

  // create new user
  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: passwordHash,
  });

  // save user and return response
  const savedUser = await newUser.save();
  res.status(200).json(savedUser);
});

// LOGIN
authRouter.post("/login", async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  !user && res.status(404).json("user not found");
});

module.exports = authRouter;
