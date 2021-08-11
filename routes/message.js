const messageRouter = require("express").Router();
const Message = require("../models/Message");

// add message
messageRouter.post("/", async (req, res) => {
  const newMessage = new Message(req.body);

  const savedMessage = await newMessage.save();
  res.status(200).json(savedMessage);
});

// get message
messageRouter.get("/:conversationId", async (req, res) => {
  const messages = await Message.find({
    conversationId: req.params.conversationId,
  });
  res.status(200).json(messages);
});

module.exports = messageRouter;
