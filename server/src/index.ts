import express, { Express, Request, Response } from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
const app: Express = express();
const port = process.env.PORT || 5000;

// CORS configuration
const corsOptions = {
  origin: ["http://localhost:5173"],
  credentials: true, // Allow credentials (cookies, authorization headers)
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Routes
app.get("/", (req: Request, res: Response) => {
  res.send("Hello from Agric Land Server!");
});

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI;

// function to connect to MongoDB
const connectToMongoDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
};

import authRoute from "../routes/auth.route";

app.use("/api/auth", authRoute);

// Start server
app.listen(port, async () => {
  console.log(`Server is running on port ${port}`);
  await connectToMongoDB();
});
