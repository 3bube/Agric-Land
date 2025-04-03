"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateInquiryStatus = exports.getInquiriesForLandOwner = exports.getInquiriesForFarmer = exports.createInquiry = void 0;
const Inquiry_model_1 = __importDefault(require("../models/Inquiry.model"));
const notification_model_1 = __importDefault(require("../models/notification.model"));
const handler_1 = require("../utils/handler");
// Create a new inquiry
const createInquiry = async (req, res, next) => {
    try {
        const { farmer, land, message } = req.body;
        const userId = req.user._id;
        // Check if farmer already has an active inquiry for this land
        const existingInquiry = await Inquiry_model_1.default.findOne({
            farmer,
            land,
            status: { $in: ["pending", "accepted"] }
        });
        if (existingInquiry) {
            return (0, handler_1.handleError)(new Error("You already have an active inquiry for this land"), res, next);
        }
        const inquiry = await Inquiry_model_1.default.create({
            farmer,
            land,
            message,
        });
        const populatedInquiry = await inquiry.populate([
            { path: "farmer", select: "name email" },
            { path: "land", select: "title ownerId" },
        ]);
        // Create notification for landowner
        await notification_model_1.default.create({
            sender: userId,
            receiver: populatedInquiry.land.ownerId,
            type: "inquiry_created",
            content: `${populatedInquiry.farmer.name} has inquired about ${populatedInquiry.land.title}`,
            data: {
                inquiryId: inquiry._id,
                landId: land,
            },
        });
        // Emit notification
        const io = req.app.get("io");
        if (io) {
            io.emitToUser(populatedInquiry.land.ownerId.toString(), "new_notification");
        }
        (0, handler_1.handleSuccess)(populatedInquiry, res);
    }
    catch (error) {
        (0, handler_1.handleError)(error, res, next);
    }
};
exports.createInquiry = createInquiry;
// Get inquiries for a farmer
const getInquiriesForFarmer = async (req, res, next) => {
    try {
        const { farmerId } = req.params;
        const inquiries = await Inquiry_model_1.default.find({ farmer: farmerId })
            .populate([
            { path: "farmer", select: "name email" },
            { path: "land", select: "title location size rentalCost ownerId" },
        ])
            .sort({ createdAt: -1 });
        (0, handler_1.handleSuccess)(inquiries, res);
    }
    catch (error) {
        (0, handler_1.handleError)(error, res, next);
    }
};
exports.getInquiriesForFarmer = getInquiriesForFarmer;
// Get inquiries for a landowner
const getInquiriesForLandOwner = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const inquiries = await Inquiry_model_1.default.find()
            .populate([
            { path: "farmer", select: "name email" },
            {
                path: "land",
                match: { ownerId: userId },
                select: "title location size rentalCost ownerId",
            },
        ])
            .sort({ createdAt: -1 });
        // Filter out inquiries where land is null (not owned by this landowner)
        const filteredInquiries = inquiries.filter((inquiry) => inquiry.land !== null);
        (0, handler_1.handleSuccess)(filteredInquiries, res);
    }
    catch (error) {
        (0, handler_1.handleError)(error, res, next);
    }
};
exports.getInquiriesForLandOwner = getInquiriesForLandOwner;
// Update inquiry status
const updateInquiryStatus = async (req, res, next) => {
    try {
        const { inquiryId } = req.params;
        const { status, landId } = req.body;
        const userId = req.user._id;
        const inquiry = await Inquiry_model_1.default.findById(inquiryId).populate([
            { path: "farmer", select: "name email" },
            { path: "land", select: "title ownerId" },
        ]);
        if (!inquiry) {
            return (0, handler_1.handleNotFound)("Inquiry not found", res, next);
        }
        inquiry.status = status;
        await inquiry.save();
        // Create notification for the farmer
        await notification_model_1.default.create({
            sender: userId,
            receiver: inquiry.farmer._id,
            type: "inquiry_status_updated",
            content: `Your inquiry for ${inquiry.land.title} has been ${status}`,
            data: {
                inquiryId: inquiry._id,
                landId,
                status,
            },
        });
        // Emit notification
        const io = req.app.get("io");
        if (io) {
            io.emitToUser(inquiry.farmer._id.toString(), "new_notification");
        }
        (0, handler_1.handleSuccess)(inquiry, res);
    }
    catch (error) {
        (0, handler_1.handleError)(error, res, next);
    }
};
exports.updateInquiryStatus = updateInquiryStatus;
