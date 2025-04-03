"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Chat = exports.Message = void 0;
const mongoose_1 = require("mongoose");
const MessageSchema = new mongoose_1.Schema({
    sender: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    receiver: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    read: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });
const ChatSchema = new mongoose_1.Schema({
    participants: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "User",
        },
    ],
    messages: [MessageSchema],
    lastMessage: {
        type: String,
    },
}, { timestamps: true });
exports.Message = (0, mongoose_1.model)("Message", MessageSchema);
exports.Chat = (0, mongoose_1.model)("Chat", ChatSchema);
