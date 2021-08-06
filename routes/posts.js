const postsRouter = require("express").Router();
const Post = require("../models/Post");

// create a post
postsRouter.post("/", async (req, res) => {
  const newPost = new Post(req.body);
});

// update a post
// delete a post
// like a post
// get a post
// get timeline posts

module.exports = postsRouter;
