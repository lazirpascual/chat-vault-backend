const postsRouter = require("express").Router();
const Post = require("../models/Post");
const User = require("../models/User");
const middleware = require("../utils/middleware");

// create a post
postsRouter.post("/", middleware.tokenAuth, async (req, res) => {
  const newPost = new Post(req.body);
  const savedPost = await newPost.save();
  res.status(200).json(savedPost);
});

// update a post
postsRouter.put("/:id", middleware.tokenAuth, async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (post.userId === req.body.userId) {
    await post.updateOne({ $set: req.body });
    res.status(200).json("The post has been updated.");
  } else {
    res.status(403).json("Only the user can update this post.");
  }
});

// delete a post
postsRouter.delete(
  "/:postId/:userId",
  middleware.tokenAuth,
  async (req, res) => {
    const post = await Post.findById(req.params.postId);
    if (post.userId === req.params.userId) {
      await post.deleteOne();
      res.status(200).json("The post has been deleted.");
    } else {
      res.status(403).json("Only the user can delete this post.");
    }
  }
);

// like/dislike a post
postsRouter.put("/:id/like", middleware.tokenAuth, async (req, res) => {
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
postsRouter.get("/timeline/:userId", async (req, res) => {
  // get all posts including posts from followed users
  const currentUser = await User.findById(req.params.userId);
  const userPosts = await Post.find({ userId: currentUser._id });
  const friendPosts = await Promise.all(
    currentUser.followings.map((friendId) => {
      return Post.find({ userId: friendId });
    })
  );
  res.status(200).json(userPosts.concat(...friendPosts));
});

// get all of a user's posts
postsRouter.get("/profile/:username", async (req, res) => {
  const user = await User.findOne({ username: req.params.username });
  const posts = await Post.find({ userId: user._id });
  res.status(200).json(posts);
});

module.exports = postsRouter;
