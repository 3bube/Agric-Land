"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const notification_controller_1 = require("../controllers/notification.controller");
const express_1 = require("express");
const auth_middleware_1 = __importDefault(require("../middleware/auth.middleware"));
const router = (0, express_1.Router)();
router.post("/create", auth_middleware_1.default, notification_controller_1.createNotification);
router.get("/", auth_middleware_1.default, notification_controller_1.getNotifications);
router.put("/read/:notificationId", auth_middleware_1.default, notification_controller_1.markNotificationAsRead);
exports.default = router;
