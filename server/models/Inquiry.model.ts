import { Schema, model, Document, Types } from "mongoose";

interface IUser {
  _id: Types.ObjectId;
  name: string;
  email: string;
}

export interface ILand {
  _id: Types.ObjectId;
  title: string;
  ownerId: Types.ObjectId;
}

export interface IInquiry extends Document {
  farmer: IUser;
  land: ILand;
  message: string;
  status: "pending" | "accepted" | "rejected";
  createdAt: Date;
  updatedAt: Date;
}

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

export default model<IInquiry>("Inquiry", InquirySchema);
