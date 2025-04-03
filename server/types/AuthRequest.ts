import { Request } from "express";
import { Document } from "mongoose";

// Define the user document interface
interface IUser extends Document {
  _id: string;
  email: string;
  role: string;
  name?: string;
  password?: string;
  phone?: string;
  location?: string;
  profilePicture?: string;
}

export interface AuthRequest extends Request {
  user?: IUser;
}
