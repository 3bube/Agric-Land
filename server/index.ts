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

app.get("/uri", async (req, res) => {
  res.json({ uri: MONGODB_URI });
});

if (!MONGODB_URI) {
  throw new Error("Please provide MONGODB_URI in the environment variables");
}

// Connect to MongoDB
// In your connectDB function
const connectDB = async () => {
  try {
    console.log("Attempting to connect to MongoDB...");

    // Add connection options for better reliability
    const options = {
      serverSelectionTimeoutMS: 5000, // Faster timeout for server selection
      connectTimeoutMS: 10000,
      socketTimeoutMS: 30000,
    };

    await mongoose.connect(MONGODB_URI, options);
    console.log("MongoDB Connected Successfully!");
    return true;
  } catch (error) {
    console.error("MongoDB connection error:", (error as Error).message);
    // Don't exit process in production
    if (process.env.NODE_ENV === "production") {
      return false;
    } else {
      process.exit(1);
    }
  }
};

app.get("/api/db-status", async (req, res) => {
  try {
    // Check if mongoose is connected
    const isConnected = mongoose.connection.readyState === 1;
    res.json({
      connected: isConnected,
      status: isConnected ? "Connected" : "Disconnected",
      readyState: mongoose.connection.readyState,
    });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// Create HTTP server
const httpServer = createServer(app);

// Initialize WebSocket server
const wsServer = new WebSocketServer(httpServer);
app.set("io", wsServer);

// Start server
httpServer.listen(port, async () => {
  console.log(`Server is running on port ${port}`);
  connectDB();
});

export default app;
