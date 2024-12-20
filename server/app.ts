import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { createServer } from "http";
import { Server } from "socket.io";
import mongoose from "mongoose";

// Route imports
import authRoute from "./routes/auth.route";
import userRoute from "./routes/user.route";
import landRoute from "./routes/land.route";
import inquiryRoute from "./routes/inquiry.route";
import chatRoute from "./routes/chat.route";
import messageRoute from "./routes/message.route";
import notificationRoute from "./routes/notification.route";
import rentalRoute from "./routes/rental.route";

dotenv.config();

const app = express();
const httpServer = createServer(app);

// Socket.IO setup
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL,
    credentials: true,
  },
});

// Middleware
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser());

// Make io available in req
app.set("io", io);

// Routes
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/lands", landRoute);
app.use("/api/inquiries", inquiryRoute);
app.use("/api/chats", chatRoute);
app.use("/api/messages", messageRoute);
app.use("/api/notifications", notificationRoute);
app.use("/api/rentals", rentalRoute);

// Socket.IO event handlers
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join_room", (userId: string) => {
    socket.join(userId);
    console.log(`User ${socket.id} joined room: ${userId}`);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  const errorStatus = err.status || 500;
  const errorMessage = err.message || "Something went wrong!";
  return res.status(errorStatus).send(errorMessage);
});

// Database connection
mongoose
  .connect(process.env.MONGO_URL!)
  .then(() => {
    console.log("Connected to MongoDB!");
    httpServer.listen(8800, () => {
      console.log("Backend server is running on port 8800");
    });
  })
  .catch((err) => console.log(err));

export default app;
