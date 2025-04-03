"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const LandSchema = new mongoose_1.Schema({
    ownerId: { type: String, ref: "User", required: true },
    title: { type: String, required: true },
    description: { type: String },
    size: { type: String, required: true },
    location: { type: String, required: true },
    soilType: { type: String },
    rentalCost: { type: Number, required: true },
    features: { type: [String] },
    status: {
        type: String,
        enum: ["available", "rented", "under-maintenance"],
        default: "available",
    },
    image: { type: String },
}, { timestamps: true });
const Land = (0, mongoose_1.model)("Land", LandSchema);
exports.default = Land;
