import express, { Express, Request, Response } from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { createServer } from "http";
import { WebSocketServer } from "./src/websocket";

// Routes imports
import authRoute from "./routes/auth.route";
import landRoute from "./routes/land.route";
import favoriteRoute from "./routes/favorites.route";
import inquiryRoute from "./routes/inquiry.route";
import chatRoute from "./routes/chat.route";
import notificationRoute from "./routes/notification.route";
import rentalRoute from "./routes/rental.route";

// Initialize app
dotenv.config();
const app: Express = express();
const port = process.env.PORT || 5000;

// Simple CORS middleware - allow all origins
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

// Handle OPTIONS requests
app.options("*", (req, res) => {
  res.sendStatus(200);
});

// Middleware
app.use(express.json());

// Routes
app.get("/", (req: Request, res: Response) => {
  res.send("Hello from Agric Land Server!");
});

// API routes
app.use("/api/auth", authRoute);
app.use("/api/land", landRoute);
app.use("/api/favorite", favoriteRoute);
app.use("/api/inquiry", inquiryRoute);
app.use("/api/chat", chatRoute);
app.use("/api/notifications", notificationRoute);
app.use("/api/rentals", rentalRoute);

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("Please provide MONGODB_URI in the environment variables");
}

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("MongoDB Connected");
  } catch (error) {
    console.error("MongoDB connection error:", (error as Error).message);
    process.exit(1);
  }
};

// Create HTTP server
const httpServer = createServer(app);

// Initialize WebSocket server
const wsServer = new WebSocketServer(httpServer);
app.set("io", wsServer);

// Start server
httpServer.listen(port, async () => {
  await connectDB();
  console.log(`Server is running on port ${port}`);
});

export default app;
