import { Request, Response, NextFunction } from "express";
import Rental from "../models/rental.model";
import Inquiry from "../models/Inquiry.model";
import Land from "../models/land.model";
import Notification from "../models/notification.model";
import { handleError, handleSuccess, handleNotFound } from "../utils/handler";

// Create rental agreement from accepted inquiry
export const createRental = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { inquiryId, startDate, endDate, rentalAmount, terms } = req.body;
    const userId = req.user._id;

    // Get the inquiry
    const inquiry = await Inquiry.findById(inquiryId).populate([
      { path: "farmer", select: "name email" },
      { path: "land", select: "title location size rentalCost ownerId" },
    ]);

    if (!inquiry) {
      return handleNotFound("Inquiry not found", res, next);
    }

    // Verify landowner
    if (inquiry.land.ownerId.toString() !== userId.toString()) {
      return handleError(
        new Error("Not authorized to create rental agreement"),
        res,
        next
      );
    }

    // Create rental agreement
    const rental = await Rental.create({
      land: inquiry.land._id,
      farmer: inquiry.farmer._id,
      landowner: userId,
      startDate,
      endDate,
      rentalAmount,
      terms,
      signedByLandowner: true, // Landowner signs by creating
    });

    // Update land status to rented
    await Land.findByIdAndUpdate(inquiry.land._id, { status: "rented" });

    // Create notification for farmer
    await Notification.create({
      sender: userId,
      receiver: inquiry.farmer._id,
      type: "rental_created",
      content: `A rental agreement has been created for ${inquiry.land.title}`,
      data: {
        rentalId: rental._id,
        landId: inquiry.land._id,
      },
    });

    // Emit notification
    const io = req.app.get("io");
    if (io) {
      io.emitToUser(inquiry.farmer._id.toString(), "new_notification");
    }

    // Update inquiry status
    inquiry.status = "accepted";
    await inquiry.save();

    handleSuccess(rental, res);
  } catch (error) {
    handleError(error, res, next);
  }
};

// Sign rental agreement (for farmer)
export const signRental = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { rentalId } = req.params;
    const userId = req.user._id;

    const rental = await Rental.findById(rentalId).populate([
      { path: "landowner", select: "name email" },
      { path: "land", select: "title" },
    ]);

    if (!rental) {
      return handleNotFound("Rental agreement not found", res, next);
    }

    // Verify farmer
    if (rental.farmer.toString() !== userId.toString()) {
      return handleError(
        new Error("Not authorized to sign this agreement"),
        res,
        next
      );
    }

    rental.signedByFarmer = true;
    await rental.save();

    // Create notification for landowner
    await Notification.create({
      sender: userId,
      receiver: rental.landowner._id,
      type: "rental_signed",
      content: `Farmer has signed the rental agreement for ${rental.land.title}`,
      data: {
        rentalId: rental._id,
      },
    });

    // Emit notification
    const io = req.app.get("io");
    if (io) {
      io.emitToUser(rental.landowner._id.toString(), "new_notification");
    }

    handleSuccess(rental, res);
  } catch (error) {
    handleError(error, res, next);
  }
};

// Get rentals for user (both farmer and landowner)
export const getRentals = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user._id;
    const userRole = req.user.role;

    const query =
      userRole === "farmer" ? { farmer: userId } : { landowner: userId };

    const rentals = await Rental.find(query)
      .populate([
        { path: "land", select: "title location size rentalCost" },
        { path: "farmer", select: "name email" },
        { path: "landowner", select: "name email" },
      ])
      .sort({ createdAt: -1 });

    handleSuccess(rentals, res);
  } catch (error) {
    handleError(error, res, next);
  }
};

// Update rental status
export const updateRentalStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { rentalId } = req.params;
    const { status } = req.body;
    const userId = req.user._id;

    const rental = await Rental.findById(rentalId).populate([
      { path: "farmer", select: "name email" },
      { path: "land", select: "title" },
    ]);

    if (!rental) {
      return handleNotFound("Rental agreement not found", res, next);
    }

    // Verify landowner
    if (rental.landowner.toString() !== userId.toString()) {
      return handleError(
        new Error("Not authorized to update rental status"),
        res,
        next
      );
    }

    rental.status = status;
    await rental.save();

    // Update land status based on rental status
    if (status === "completed" || status === "terminated") {
      await Land.findByIdAndUpdate(rental.land, { status: "available" });
    } else if (status === "active") {
      await Land.findByIdAndUpdate(rental.land, { status: "rented" });
    }

    // Create notification for farmer
    await Notification.create({
      sender: userId,
      receiver: rental.farmer._id,
      type: "rental_updated",
      content: `Rental agreement for ${rental.land.title} has been ${status}`,
      data: {
        rentalId: rental._id,
        status,
      },
    });

    // Emit notification
    const io = req.app.get("io");
    if (io) {
      io.emitToUser(rental.farmer._id.toString(), "new_notification");
    }

    handleSuccess(rental, res);
  } catch (error) {
    handleError(error, res, next);
  }
};

// Update payment status
export const updatePaymentStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { rentalId } = req.params;
    const { paymentStatus } = req.body;
    const userId = req.user._id;

    const rental = await Rental.findById(rentalId).populate([
      { path: "farmer", select: "name email" },
      { path: "land", select: "title" },
    ]);

    if (!rental) {
      return handleNotFound("Rental agreement not found", res, next);
    }

    // Verify landowner
    if (rental.landowner.toString() !== userId.toString()) {
      return handleError(
        new Error("Not authorized to update payment status"),
        res,
        next
      );
    }

    rental.paymentStatus = paymentStatus;
    await rental.save();

    // Create notification for farmer
    await Notification.create({
      sender: userId,
      receiver: rental.farmer._id,
      type: "payment_status_updated",
      content: `Payment status for ${rental.land.title} has been marked as ${paymentStatus}`,
      data: {
        rentalId: rental._id,
        paymentStatus,
      },
    });

    // Emit notification
    const io = req.app.get("io");
    if (io) {
      io.emitToUser(rental.farmer._id.toString(), "new_notification");
    }

    handleSuccess(rental, res);
  } catch (error) {
    handleError(error, res, next);
  }
};
