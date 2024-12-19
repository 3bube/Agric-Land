import { Request, Response, NextFunction } from "express";
import { Chat, Message } from "../models/chat.model";
import { handleError, handleSuccess, handleNotFound } from "../utils/handler";

export const createOrGetChat = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { participantId } = req.body;
    const userId = req.user.id;

    // Check if chat already exists
    let chat = await Chat.findOne({
      participants: { $all: [userId, participantId] },
    }).populate("participants", "name email");

    if (!chat) {
      // Create new chat
      chat = await Chat.create({
        participants: [userId, participantId],
        messages: [],
      });
      chat = await chat.populate("participants", "name email");
    }

    handleSuccess(chat, res);
  } catch (error) {
    handleError(error, res, next);
  }
};

export const sendMessage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { chatId, content } = req.body;
    const userId = req.user.id;

    const chat = await Chat.findById(chatId);
    if (!chat) {
      return handleNotFound(res, "Chat not found", next);
    }

    const message = new Message({
      sender: userId,
      receiver: chat.participants.find((p) => p.toString() !== userId),
      content,
    });

    chat.messages.push(message);
    chat.lastMessage = message._id;
    await chat.save();

    // Emit socket event for real-time updates
    const io = req.app.get("io");
    const receiverId = chat.participants.find(
      (p) => p.toString() !== userId
    );
    
    if (io && receiverId) {
      io.emitToUser(receiverId.toString(), "new_message", {
        chatId,
        message: {
          ...message.toJSON(),
          sender: { _id: userId },
        },
      });
    }

    handleSuccess(message, res);
  } catch (error) {
    handleError(error, res, next);
  }
};

export const getMessages = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { chatId } = req.params;
    const chat = await Chat.findById(chatId)
      .populate("messages.sender", "name")
      .populate("messages.receiver", "name");

    if (!chat) {
      return handleNotFound(res, "Chat not found", next);
    }

    handleSuccess(chat.messages, res);
  } catch (error) {
    handleError(error, res, next);
  }
};

export const getUserChats = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user.id;
    const chats = await Chat.find({ participants: userId })
      .populate("participants", "name email")
      .populate("lastMessage")
      .sort({ updatedAt: -1 });

    handleSuccess(chats, res);
  } catch (error) {
    handleError(error, res, next);
  }
};

export const markMessageAsRead = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { messageId } = req.params;
    const message = await Message.findByIdAndUpdate(
      messageId,
      { read: true },
      { new: true }
    );

    if (!message) {
      return handleNotFound(res, "Message not found", next);
    }

    handleSuccess(message, res);
  } catch (error) {
    handleError(error, res, next);
  }
};
