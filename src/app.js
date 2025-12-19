const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const connectDb = require("./config/database");
const cors = require("cors");
const cookie_parser = require("cookie-parser");

const app = express();
const httpServer = createServer(app);

const authRouter = require("./routes/authRouter");
const profileRouter = require("./routes/profileRouter");
const userRouter = require("./routes/userRouter");
const requestRouter = require("./routes/requestRouter");
const chatRouter = require("./routes/chatRouter");
const Chat = require("./models/Chat");

// CORS config
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use("/", express.json());
app.use(cookie_parser());

// Routes
app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", userRouter);
app.use("/", requestRouter);
app.use("/", chatRouter);

// Socket.IO setup
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

// Track online users: { odtaId: socketId }
const onlineUsers = new Map();

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // User joins with their userId
  socket.on("join", (userId) => {
    onlineUsers.set(userId, socket.id);
    console.log("User joined:", userId);
  });

  // Handle sending messages
  socket.on("sendMessage", async ({ senderId, receiverId, message }) => {
    try {
      // Save message to database
      const newMessage = new Chat({
        senderId,
        receiverId,
        message,
      });
      await newMessage.save();

      // Send to receiver if online
      const receiverSocketId = onlineUsers.get(receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("receiveMessage", {
          senderId,
          receiverId,
          message,
          createdAt: newMessage.createdAt,
        });
      }

      // Send confirmation back to sender
      socket.emit("messageSent", {
        senderId,
        receiverId,
        message,
        createdAt: newMessage.createdAt,
      });
    } catch (err) {
      console.log("Error saving message:", err);
      socket.emit("messageError", { error: "Failed to send message" });
    }
  });

  socket.on("disconnect", () => {
    // Remove user from online list
    for (const [userId, socketId] of onlineUsers.entries()) {
      if (socketId === socket.id) {
        onlineUsers.delete(userId);
        break;
      }
    }
    console.log("User disconnected:", socket.id);
  });
});

// Start server
connectDb()
  .then(() => {
    console.log("db connection was succesfull");

    httpServer.listen(7777, () => {
      console.log("Server listening on port 7777");
    });
  })
  .catch((err) => console.log("damm encountered the errir here", err));
