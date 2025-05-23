import { Schema, model } from "mongoose";

const NotificationSchema = new Schema(
  {
    sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
    receiver: { type: Schema.Types.ObjectId, ref: "User", required: true },
    type: { type: String, required: true },
    content: { type: String, required: true },
    data: { type: Schema.Types.Mixed },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Notification = model("Notification", NotificationSchema);

export default Notification;
