// In express.d.ts
import { Document } from "mongoose";
import { Request as ExpressRequest } from "express";

// Define what a user document looks like
interface UserDocument extends Document {
  _id: string;
  name?: string;
  email: string;
  role: string;
  // Add other user properties as needed
}

declare global {
  namespace Express {
    interface Request {
      user?: UserDocument;
    }
  }
}
