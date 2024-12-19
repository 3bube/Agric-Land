import { Schema, model } from "mongoose";

const LandSchema = new Schema(
  {
    ownerId: { type: String, ref: "User", required: true },
    title: { type: String, required: true },
    description: { type: String },
    size: { type: String, required: true },
    location: { type: String, required: true },
    soilType: { type: String },
    rentalCost: { type: Number, required: true },
    features: { type: [String] },
    status: {
      type: String,
      enum: ["available", "rented", "under-maintenance"],
      default: "available",
    },
    image: { type: String },
  },
  { timestamps: true }
);

const Land = model("Land", LandSchema);

export default Land;
