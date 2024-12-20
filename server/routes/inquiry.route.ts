import { Router } from "express";
import {
  createInquiry,
  getInquiriesForFarmer,
  getInquiriesForLandOwner,
  updateInquiryStatus,
} from "../controllers/inquiry.controller";
import authMiddleware from "../middleware/auth.middleware";

const router = Router();

// Create a new inquiry
router.post("/create", authMiddleware, createInquiry);

// Get inquiries for a farmer
router.get("/farmer/:farmerId", authMiddleware, getInquiriesForFarmer);

// Get inquiries for a landowner
router.get("/landowner", authMiddleware, getInquiriesForLandOwner);

// Update inquiry status
router.put("/:inquiryId/status", authMiddleware, updateInquiryStatus);

export default router;
