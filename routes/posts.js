const postsRouter = require("express").Router();
const Post = require("../models/Post");

// create a post
postsRouter.post("/", async (req, res) => {
  const newPost = new Post(req.body);
  const savedPost = await newPost.save();
  res.status(200).json(savedPost);
});

// update a post
postsRouter.put("/:id", async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (post.userId === req.body.userId) {
    await post.updateOne({ $set: req.body });
    res.status(200).json("The Post has been updated.");
  } else {
    res.status(403).json("Only the user can update this post.");
  }
});

// delete a post
// like a post
// get a post
// get timeline posts

module.exports = postsRouter;
