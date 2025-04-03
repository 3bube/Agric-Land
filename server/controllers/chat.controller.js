"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.markMessageAsRead = exports.getUserChats = exports.getMessages = exports.sendMessage = exports.createOrGetChat = void 0;
const chat_model_1 = require("../models/chat.model");
const notification_model_1 = __importDefault(require("../models/notification.model"));
const handler_1 = require("../utils/handler");
const createOrGetChat = async (req, res, next) => {
    try {
        const { participantId } = req.body;
        const userId = req.user._id;
        // Check if chat already exists
        let chat = await chat_model_1.Chat.findOne({
            participants: { $all: [userId, participantId] },
        }).populate("participants", "name email");
        if (!chat) {
            // Create new chat
            chat = await chat_model_1.Chat.create({
                participants: [userId, participantId],
                messages: [],
            });
            chat = await chat.populate("participants", "name email");
        }
        (0, handler_1.handleSuccess)(chat, res);
    }
    catch (error) {
        (0, handler_1.handleError)(error, res, next);
    }
};
exports.createOrGetChat = createOrGetChat;
const sendMessage = async (req, res, next) => {
    try {
        const { chatId, content } = req.body;
        const userId = req.user._id;
        const chat = await chat_model_1.Chat.findById(chatId);
        if (!chat) {
            return (0, handler_1.handleNotFound)(res, "Chat not found", next);
        }
        // Find the receiver ID (the participant that is not the sender)
        const receiverId = chat.participants.find((participantId) => participantId.toString() !== userId.toString());
        if (!receiverId) {
            return (0, handler_1.handleError)(new Error("Receiver not found in chat"), res, next);
        }
        const message = new chat_model_1.Message({
            sender: userId,
            receiver: receiverId,
            content,
        });
        chat.messages.push(message);
        chat.lastMessage = message.content;
        await chat.save();
        // Emit socket event for real-time updates
        const io = req.app.get("io");
        if (io) {
            io.emitToUser(receiverId.toString(), "new_message", {
                chatId,
                message: {
                    ...message.toJSON(),
                    sender: { _id: userId },
                },
            });
            // Create notification for the message
            const notification = new notification_model_1.default({
                sender: userId,
                receiver: receiverId,
                type: "new_message",
                content,
                data: {
                    chatId,
                    message: {
                        ...message.toJSON(),
                        sender: { _id: userId },
                    },
                },
            });
            await notification.save();
            io.emitToUser(receiverId.toString(), "new_notification");
        }
        (0, handler_1.handleSuccess)(message, res);
    }
    catch (error) {
        (0, handler_1.handleError)(error, res, next);
    }
};
exports.sendMessage = sendMessage;
const getMessages = async (req, res, next) => {
    try {
        const { chatId } = req.params;
        const chat = await chat_model_1.Chat.findById(chatId)
            .populate("messages.sender", "name")
            .populate("messages.receiver", "name");
        if (!chat) {
            return (0, handler_1.handleNotFound)(res, "Chat not found", next);
        }
        (0, handler_1.handleSuccess)(chat.messages, res);
    }
    catch (error) {
        (0, handler_1.handleError)(error, res, next);
    }
};
exports.getMessages = getMessages;
const getUserChats = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const chats = await chat_model_1.Chat.find({ participants: userId })
            .populate("participants", "name email")
            .populate("lastMessage")
            .sort({ updatedAt: -1 });
        (0, handler_1.handleSuccess)(chats, res);
    }
    catch (error) {
        (0, handler_1.handleError)(error, res, next);
    }
};
exports.getUserChats = getUserChats;
const markMessageAsRead = async (req, res, next) => {
    try {
        const { messageId } = req.params;
        const message = await chat_model_1.Message.findByIdAndUpdate(messageId, { read: true }, { new: true });
        if (!message) {
            return (0, handler_1.handleNotFound)(res, "Message not found", next);
        }
        (0, handler_1.handleSuccess)(message, res);
    }
    catch (error) {
        (0, handler_1.handleError)(error, res, next);
    }
};
exports.markMessageAsRead = markMessageAsRead;
