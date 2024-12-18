import { Schema, model } from "mongoose";

const LandSchema = new Schema(
  {
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    description: { type: String },
    size: { type: String, required: true },
    location: { type: String, required: true },
    soilType: { type: String },
    rentalCost: { type: Number, required: true },
    isAvailable: { type: Boolean, default: true },
    images: [{ type: String }],
  },
  { timestamps: true }
);

const Land = model("Land", LandSchema);

export default Land;
