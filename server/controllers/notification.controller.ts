import Notification from "../models/notification.model";
import { Request, Response, NextFunction } from "express";
import { handleError, handleSuccess } from "../utils/handler";
import { AuthRequest } from "../types/AuthRequest";

export const createNotification = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const notification = await Notification.create(req.body);
    handleSuccess(notification, res);
  } catch (error) {
    handleError(error, res, next);
  }
};

export const getNotifications = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?._id;
    const notifications = await Notification.find({ receiver: userId });
    handleSuccess(notifications, res);
  } catch (error) {
    handleError(error, res, next);
  }
};

export const markNotificationAsRead = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { notificationId } = req.params;
    const notification = await Notification.findByIdAndUpdate(
      notificationId,
      { read: true },
      { new: true }
    );
    handleSuccess(notification, res);
  } catch (error) {
    handleError(error, res, next);
  }
};
