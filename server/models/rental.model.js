"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const RentalSchema = new mongoose_1.Schema({
    land: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Land",
        required: true,
    },
    farmer: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    landowner: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    startDate: {
        type: Date,
        required: true,
    },
    endDate: {
        type: Date,
        required: true,
    },
    rentalAmount: {
        type: Number,
        required: true,
    },
    paymentStatus: {
        type: String,
        enum: ["pending", "paid", "overdue"],
        default: "pending",
    },
    status: {
        type: String,
        enum: ["active", "completed", "terminated"],
        default: "active",
    },
    terms: {
        type: String,
        required: true,
    },
    signedByFarmer: {
        type: Boolean,
        default: false,
    },
    signedByLandowner: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });
exports.default = (0, mongoose_1.model)("Rental", RentalSchema);
