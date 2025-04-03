"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.markNotificationAsRead = exports.getNotifications = exports.createNotification = void 0;
const notification_model_1 = __importDefault(require("../models/notification.model"));
const handler_1 = require("../utils/handler");
const createNotification = async (req, res, next) => {
    try {
        const notification = await notification_model_1.default.create(req.body);
        (0, handler_1.handleSuccess)(notification, res);
    }
    catch (error) {
        (0, handler_1.handleError)(error, res, next);
    }
};
exports.createNotification = createNotification;
const getNotifications = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const notifications = await notification_model_1.default.find({ receiver: userId });
        (0, handler_1.handleSuccess)(notifications, res);
    }
    catch (error) {
        (0, handler_1.handleError)(error, res, next);
    }
};
exports.getNotifications = getNotifications;
const markNotificationAsRead = async (req, res, next) => {
    try {
        const { notificationId } = req.params;
        const notification = await notification_model_1.default.findByIdAndUpdate(notificationId, { read: true }, { new: true });
        (0, handler_1.handleSuccess)(notification, res);
    }
    catch (error) {
        (0, handler_1.handleError)(error, res, next);
    }
};
exports.markNotificationAsRead = markNotificationAsRead;
