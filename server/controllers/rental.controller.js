"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePaymentStatus = exports.updateRentalStatus = exports.getRentals = exports.signRental = exports.createRental = void 0;
const rental_model_1 = __importDefault(require("../models/rental.model"));
const Inquiry_model_1 = __importDefault(require("../models/Inquiry.model"));
const land_model_1 = __importDefault(require("../models/land.model"));
const notification_model_1 = __importDefault(require("../models/notification.model"));
const handler_1 = require("../utils/handler");
// Create rental agreement from accepted inquiry
const createRental = async (req, res, next) => {
    try {
        const { inquiryId, startDate, endDate, rentalAmount, terms } = req.body;
        const userId = req.user._id;
        // Get the inquiry
        const inquiry = await Inquiry_model_1.default.findById(inquiryId).populate([
            { path: "farmer", select: "name email" },
            { path: "land", select: "title location size rentalCost ownerId" },
        ]);
        if (!inquiry) {
            return (0, handler_1.handleNotFound)("Inquiry not found", res, next);
        }
        // Verify landowner
        if (inquiry.land.ownerId.toString() !== userId.toString()) {
            return (0, handler_1.handleError)(new Error("Not authorized to create rental agreement"), res, next);
        }
        // Create rental agreement
        const rental = await rental_model_1.default.create({
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
        await land_model_1.default.findByIdAndUpdate(inquiry.land._id, { status: "rented" });
        // Create notification for farmer
        await notification_model_1.default.create({
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
        (0, handler_1.handleSuccess)(rental, res);
    }
    catch (error) {
        (0, handler_1.handleError)(error, res, next);
    }
};
exports.createRental = createRental;
// Sign rental agreement (for farmer)
const signRental = async (req, res, next) => {
    try {
        const { rentalId } = req.params;
        const userId = req.user._id;
        const rental = await rental_model_1.default.findById(rentalId).populate([
            { path: "landowner", select: "name email" },
            { path: "land", select: "title" },
        ]);
        if (!rental) {
            return (0, handler_1.handleNotFound)("Rental agreement not found", res, next);
        }
        // Verify farmer
        if (rental.farmer.toString() !== userId.toString()) {
            return (0, handler_1.handleError)(new Error("Not authorized to sign this agreement"), res, next);
        }
        rental.signedByFarmer = true;
        await rental.save();
        // Create notification for landowner
        await notification_model_1.default.create({
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
        (0, handler_1.handleSuccess)(rental, res);
    }
    catch (error) {
        (0, handler_1.handleError)(error, res, next);
    }
};
exports.signRental = signRental;
// Get rentals for user (both farmer and landowner)
const getRentals = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const userRole = req.user.role;
        const query = userRole === "farmer" ? { farmer: userId } : { landowner: userId };
        const rentals = await rental_model_1.default.find(query)
            .populate([
            { path: "land", select: "title location size rentalCost" },
            { path: "farmer", select: "name email" },
            { path: "landowner", select: "name email" },
        ])
            .sort({ createdAt: -1 });
        (0, handler_1.handleSuccess)(rentals, res);
    }
    catch (error) {
        (0, handler_1.handleError)(error, res, next);
    }
};
exports.getRentals = getRentals;
// Update rental status
const updateRentalStatus = async (req, res, next) => {
    try {
        const { rentalId } = req.params;
        const { status } = req.body;
        const userId = req.user._id;
        const rental = await rental_model_1.default.findById(rentalId).populate([
            { path: "farmer", select: "name email" },
            { path: "land", select: "title" },
        ]);
        if (!rental) {
            return (0, handler_1.handleNotFound)("Rental agreement not found", res, next);
        }
        // Verify landowner
        if (rental.landowner.toString() !== userId.toString()) {
            return (0, handler_1.handleError)(new Error("Not authorized to update rental status"), res, next);
        }
        rental.status = status;
        await rental.save();
        // Update land status based on rental status
        if (status === "completed" || status === "terminated") {
            await land_model_1.default.findByIdAndUpdate(rental.land, { status: "available" });
        }
        else if (status === "active") {
            await land_model_1.default.findByIdAndUpdate(rental.land, { status: "rented" });
        }
        // Create notification for farmer
        await notification_model_1.default.create({
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
        (0, handler_1.handleSuccess)(rental, res);
    }
    catch (error) {
        (0, handler_1.handleError)(error, res, next);
    }
};
exports.updateRentalStatus = updateRentalStatus;
// Update payment status
const updatePaymentStatus = async (req, res, next) => {
    try {
        const { rentalId } = req.params;
        const { paymentStatus } = req.body;
        const userId = req.user._id;
        const rental = await rental_model_1.default.findById(rentalId).populate([
            { path: "farmer", select: "name email" },
            { path: "land", select: "title" },
        ]);
        if (!rental) {
            return (0, handler_1.handleNotFound)("Rental agreement not found", res, next);
        }
        // Verify landowner
        if (rental.landowner.toString() !== userId.toString()) {
            return (0, handler_1.handleError)(new Error("Not authorized to update payment status"), res, next);
        }
        rental.paymentStatus = paymentStatus;
        await rental.save();
        // Create notification for farmer
        await notification_model_1.default.create({
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
        (0, handler_1.handleSuccess)(rental, res);
    }
    catch (error) {
        (0, handler_1.handleError)(error, res, next);
    }
};
exports.updatePaymentStatus = updatePaymentStatus;
