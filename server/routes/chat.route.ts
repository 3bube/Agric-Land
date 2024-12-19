import { Router } from "express";
import {
  createOrGetChat,
  sendMessage,
  getMessages,
  getUserChats,
  markMessageAsRead,
} from "../controllers/chat.controller";
import authMiddleware from "@/middleware/auth.middleware";

const router = Router();

router.post("/create", authMiddleware, createOrGetChat);
router.post("/message", authMiddleware, sendMessage);
router.get("/messages/:chatId", authMiddleware, getMessages);
router.get("/user", authMiddleware, getUserChats);
router.put("/message/read/:messageId", authMiddleware, markMessageAsRead);

export default router;
