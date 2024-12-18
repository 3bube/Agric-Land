import { Schema, model } from "mongoose";

const InquirySchema = new Schema(
  {
    land: { type: Schema.Types.ObjectId, ref: "Land", required: true },
    farmer: { type: Schema.Types.ObjectId, ref: "User", required: true },
    message: { type: String },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const Inquiry = model("Inquiry", InquirySchema);

export default Inquiry;
