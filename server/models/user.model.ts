import { Schema, model } from "mongoose";

const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["farmer", "landowner"], required: true },
    phone: { type: String },
    location: { type: String },
    profilePicture: { type: String },
  },
  { timestamps: true }
);

const User = model("User", UserSchema);

export default User;
