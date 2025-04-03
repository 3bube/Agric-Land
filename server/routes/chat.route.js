"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const chat_controller_1 = require("../controllers/chat.controller");
const auth_middleware_1 = __importDefault(require("../middleware/auth.middleware"));
const router = (0, express_1.Router)();
router.post("/create", auth_middleware_1.default, chat_controller_1.createOrGetChat);
router.post("/message", auth_middleware_1.default, chat_controller_1.sendMessage);
router.get("/messages/:chatId", auth_middleware_1.default, chat_controller_1.getMessages);
router.get("/user", auth_middleware_1.default, chat_controller_1.getUserChats);
router.put("/message/read/:messageId", auth_middleware_1.default, chat_controller_1.markMessageAsRead);
exports.default = router;
