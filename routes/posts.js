const postsRouter = require("express").Router();
const Post = require("../models/Post");
const User = require("../models/User");

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
    res.status(200).json("The post has been updated.");
  } else {
    res.status(403).json("Only the user can update this post.");
  }
});

// delete a post
postsRouter.delete("/:id", async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (post.userId === req.body.userId) {
    await post.deleteOne();
    res.status(200).json("The post has been deleted.");
  } else {
    res.status(403).json("Only the user can delete this post.");
  }
});

// like/dislike a post
postsRouter.put("/:id/like", async (req, res) => {
  const post = await Post.findById(req.params.id);
  // if likes array includes userId, like the post
  if (!post.likes.includes(req.body.userId)) {
    await post.updateOne({ $push: { likes: req.body.userId } });
    res.status(200).json("The post has been liked.");
    // else, dislike the post
  } else {
    await post.updateOne({ $pull: { likes: req.body.userId } });
    res.status(403).json("The post has been disliked.");
  }
});

// get all posts
postsRouter.get("/", async (req, res) => {
  const posts = await Post.find({});
  res.json(posts);
});

// get individual post
postsRouter.get("/:id", async (req, res) => {
  const post = await Post.findById(req.params.id);
  res.status(200).json(post);
});

// get timeline posts
postsRouter.get("/timeline/all", async (req, res) => {
  // get all posts including followed users
  const currentUser = await User.findById(req.body.userId);
  const userPosts = await Post.find({ userId: currentUser._id });
  const friendPosts = await Promise.all(
    currentUser.followings.map((friendId) => {
      return Post.find({ userId: friendId });
    })
  );
  res.json(userPosts.concat(...friendPosts));
});

module.exports = postsRouter;
