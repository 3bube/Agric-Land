import { Schema, model } from "mongoose";

const RentalSchema = new Schema(
  {
    land: {
      type: Schema.Types.ObjectId,
      ref: "Land",
      required: true,
    },
    farmer: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    landowner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    rentalAmount: {
      type: Number,
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "overdue"],
      default: "pending",
    },
    status: {
      type: String,
      enum: ["active", "completed", "terminated"],
      default: "active",
    },
    terms: {
      type: String,
      required: true,
    },
    signedByFarmer: {
      type: Boolean,
      default: false,
    },
    signedByLandowner: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default model("Rental", RentalSchema);
