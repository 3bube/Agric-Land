import { Schema, model } from "mongoose";

const TransactionSchema = new Schema(
  {
    land: { type: Schema.Types.ObjectId, ref: "Land", required: true },
    landowner: { type: Schema.Types.ObjectId, ref: "User", required: true },
    farmer: { type: Schema.Types.ObjectId, ref: "User", required: true },
    transactionType: {
      type: String,
      enum: ["rental", "purchase"],
      required: true,
    },
    amount: { type: Number, required: true },
    startDate: { type: Date },
    endDate: { type: Date },
  },
  { timestamps: true }
);

const Transaction = model("Transaction", TransactionSchema);

export default Transaction;
