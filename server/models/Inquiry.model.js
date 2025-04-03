"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const InquirySchema = new mongoose_1.Schema({
    farmer: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    land: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Land",
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ["pending", "accepted", "rejected"],
        default: "pending",
    },
}, { timestamps: true });
exports.default = (0, mongoose_1.model)("Inquiry", InquirySchema);
