const { Router } = require("express");
const User = require("../models/User");
const usersRouter = require("express").Router();
const middleware = require("../utils/middleware");

// get individual user
usersRouter.get("/", async (req, res) => {
  const userId = req.query.userId;
  const username = req.query.username;

  const user = userId
    ? await User.findById(userId)
    : await User.findOne({ username: username });
  const { password, updatedAt, ...other } = user._doc;

  if (user) {
    res.status(200).json(other);
  } else {
    response.status(404).end();
  }
});

// get friends
usersRouter.get("/friends/:userId", async (req, res) => {
  const user = await User.findById(req.params.userId);
  // store all of friends into array
  const friends = await Promise.all(
    user.followings.map((friendId) => {
      return User.findById(friendId);
    })
  );
  // store friends into array with only the required properties
  let friendList = [];
  friends.map((friend) => {
    const { _id, username, profilePicture } = friend;
    friendList.push({ _id, username, profilePicture });
  });
  res.status(200).json(friendList);
});

// update user
usersRouter.put("/:id", middleware.tokenAuth, async (req, res) => {
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
usersRouter.delete("/:id", middleware.tokenAuth, async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json("Account has been deleted!");
  } else {
    return res
      .status(403)
      .json("Only the owner of this account can make a delete request");
  }
});

// follow a user
usersRouter.put("/:id/follow", middleware.tokenAuth, async (req, res) => {
  if (req.body.userId !== req.params.id) {
    const user = await User.findById(req.params.id); // user we want to follow
    const currentUser = await User.findById(req.body.userId); // current user making the follow request
    // if current user is not following this user, follow the user
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
usersRouter.put("/:id/unfollow", middleware.tokenAuth, async (req, res) => {
  if (req.body.userId !== req.params.id) {
    const user = await User.findById(req.params.id); // user we want to unfollow
    const currentUser = await User.findById(req.body.userId); // current user making the unfollow request
    // if current user is following this user, unfollow the user
    if (user.followers.includes(req.body.userId)) {
      await user.updateOne({ $pull: { followers: req.body.userId } });
      await currentUser.updateOne({ $pull: { followings: req.params.id } });
      res.status(200).json("User has been unfollowed.");
    } else {
      res.status(403).json("You are not following this user.");
    }
  } else {
    return res.status(403).json("You cannot unfollow yourself.");
  }
});

module.exports = usersRouter;
