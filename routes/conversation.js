const conversationRouter = require("express").Router();
const Conversation = require("../models/Conversation");

// create conversation
conversationRouter.post("/", async (req, res) => {
  const newConversation = new Conversation({
    members: [req.body.senderId, req.body.receiverId],
  });

  const savedConversation = await newConversation.save();
  res.status(200).json(savedConversation);
});

// get all conversations of a user
conversationRouter.get("/:userId", async (req, res) => {
  // find all conversations that contains the requested ID
  const conversation = await Conversation.find({
    members: { $in: [req.params.userId] },
  });
  res.status(200).json(conversation);
});

// get conversion of two users
conversationRouter.get("/find/:firstUserId/:secondUserId", async (req, res) => {
  const conversation = await Conversation.findOne({
    members: { $all: [req.params.firstUserId, req.params.secondUserId] },
  });
  res.status(200).json(conversation);
});

module.exports = conversationRouter;
