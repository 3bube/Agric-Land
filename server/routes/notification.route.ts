import {
  createNotification,
  getNotifications,
  markNotificationAsRead,
} from "../controllers/notification.controller";
import { Router } from "express";
import authMiddleware from "../middleware/auth.middleware";

const router = Router();

router.post("/create", authMiddleware, createNotification);
router.get("/", authMiddleware, getNotifications);
router.put("/read/:notificationId", authMiddleware, markNotificationAsRead);

export default router;
