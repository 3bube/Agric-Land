"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Notification = void 0;
const mongoose_1 = require("mongoose");
const NotificationSchema = new mongoose_1.Schema({
    sender: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    receiver: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    type: { type: String, required: true },
    content: { type: String, required: true },
    data: { type: mongoose_1.Schema.Types.Mixed },
    read: { type: Boolean, default: false },
}, { timestamps: true });
exports.Notification = (0, mongoose_1.model)("Notification", NotificationSchema);
exports.default = exports.Notification;
