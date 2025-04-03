"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const inquiry_controller_1 = require("../controllers/inquiry.controller");
const auth_middleware_1 = __importDefault(require("../middleware/auth.middleware"));
const router = (0, express_1.Router)();
// Create a new inquiry
router.post("/create", auth_middleware_1.default, inquiry_controller_1.createInquiry);
// Get inquiries for a farmer
router.get("/farmer/:farmerId", auth_middleware_1.default, inquiry_controller_1.getInquiriesForFarmer);
// Get inquiries for a landowner
router.get("/landowner", auth_middleware_1.default, inquiry_controller_1.getInquiriesForLandOwner);
// Update inquiry status
router.put("/:inquiryId/status", auth_middleware_1.default, inquiry_controller_1.updateInquiryStatus);
exports.default = router;
