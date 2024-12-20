import { Schema, model } from "mongoose";

const InquirySchema = new Schema(
  {
    farmer: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    land: {
      type: Schema.Types.ObjectId,
      ref: "Land",
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default model("Inquiry", InquirySchema);
