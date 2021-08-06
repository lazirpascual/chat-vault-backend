const User = require("../models/User");

const usersRouter = require("express").Router();

// update user
usersRouter.put("/:id", async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      req.body.password = await bcrypt.hash(req.body.password, salt);
    }
    const user = await User.findByIdAndUpdate(req.params.id, {
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

// follow a user

// unfollow a user

module.exports = usersRouter;
