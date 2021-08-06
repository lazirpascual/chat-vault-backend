const { router, response } = require("../app");
const User = require("../models/User");

const usersRouter = require("express").Router();

// update user
usersRouter.put("/:id", async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      req.body.password = await bcrypt.hash(req.body.password, salt);
    }
    await User.findByIdAndUpdate(req.params.id, {
      $set: req.body,
    });
    res.status(200).json("Account has been updated");
  } else {
    return res
      .status(403)
      .json("Only the owner of this account can make an update request");
  }
});

// delete user
usersRouter.delete("/:id", async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json("Account has been deleted!");
  } else {
    return res
      .status(403)
      .json("Only the owner of this account can make a delete request");
  }
});

// get a user
usersRouter.get("/:id", async (req, res) => {
  const user = await User.findById(req.params.id);
  const { password, updatedAt, ...other } = user._doc;

  if (user) {
    res.status(200).json(other);
  } else {
    response.status(404).end();
  }
});

// follow a user
usersRouter.put("/:id/follow", async (req, res) => {
  if (req.body.userId !== req.params.id) {
    const user = await User.findById(req.params.id); // user we want to follow
    const currentUser = await User.findById(req.body.userId); // current user making the follow request
    // if current user is not following this user, update the following/followings arrays
    if (!user.followers.includes(req.body.userId)) {
      await user.updateOne({ $push: { followers: req.body.userId } });
      await currentUser.updateOne({ $push: { followings: req.params.id } });
      res.status(200).json("User has been followed.");
    } else {
      res.status(403).json("You are already following this user.");
    }
  } else {
    return res.status(403).json("You cannot follow yourself.");
  }
});

// unfollow a user

module.exports = usersRouter;
