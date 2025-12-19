const express = require("express");
const chatRouter = express.Router();
const Chat = require("../models/Chat");
const userAuth = require("../middlewares/auth");

// Get chat history between two users
chatRouter.get("/chat/:userId", userAuth, async (req, res) => {
  try {
    const currentUserId = req.user._id;
    const otherUserId = req.params.userId;

    const messages = await Chat.find({
      $or: [
        { senderId: currentUserId, receiverId: otherUserId },
        { senderId: otherUserId, receiverId: currentUserId },
      ],
    })
      .sort({ createdAt: 1 })
      .limit(100);

    res.json({ messages });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = chatRouter;
