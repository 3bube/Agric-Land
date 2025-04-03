import { Request, Response, NextFunction } from "express";
import Inquiry from "../models/Inquiry.model";
import Notification from "../models/notification.model";
import { handleError, handleSuccess, handleNotFound } from "../utils/handler";
import { AuthRequest } from "../types/AuthRequest";

// Create a new inquiry
export const createInquiry = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { farmer, land, message } = req.body;
    const userId = req.user?._id;

    // Check if farmer already has an active inquiry for this land
    const existingInquiry = await Inquiry.findOne({
      farmer,
      land,
      status: { $in: ["pending", "accepted"] },
    });

    if (existingInquiry) {
      return handleError(
        new Error("You already have an active inquiry for this land"),
        res,
        next
      );
    }

    const inquiry = await Inquiry.create({
      farmer,
      land,
      message,
    });

    const populatedInquiry = await inquiry.populate([
      { path: "farmer", select: "name email" },
      { path: "land", select: "title ownerId" },
    ]);

    // Create notification for landowner
    await Notification.create({
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
      io.emitToUser(
        populatedInquiry.land.ownerId.toString(),
        "new_notification"
      );
    }

    handleSuccess(populatedInquiry, res);
  } catch (error) {
    handleError(error, res, next);
  }
};

// Get inquiries for a farmer
export const getInquiriesForFarmer = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { farmerId } = req.params;
    const inquiries = await Inquiry.find({ farmer: farmerId })
      .populate([
        { path: "farmer", select: "name email" },
        { path: "land", select: "title location size rentalCost ownerId" },
      ])
      .sort({ createdAt: -1 });

    handleSuccess(inquiries, res);
  } catch (error) {
    handleError(error, res, next);
  }
};

// Get inquiries for a landowner
export const getInquiriesForLandOwner = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?._id;
    const inquiries = await Inquiry.find()
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
    const filteredInquiries = inquiries.filter(
      (inquiry) => inquiry.land !== null
    );

    handleSuccess(filteredInquiries, res);
  } catch (error) {
    handleError(error, res, next);
  }
};

// Update inquiry status
export const updateInquiryStatus = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { inquiryId } = req.params;
    const { status, landId } = req.body;
    const userId = req.user?._id;

    const inquiry = await Inquiry.findById(inquiryId).populate([
      { path: "farmer", select: "name email" },
      { path: "land", select: "title ownerId" },
    ]);
    if (!inquiry) {
      return handleNotFound(res, "Inquiry not found", next);
    }

    inquiry.status = status;
    await inquiry.save();

    // Create notification for the farmer
    await Notification.create({
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

    handleSuccess(inquiry, res);
  } catch (error) {
    handleError(error, res, next);
  }
};
