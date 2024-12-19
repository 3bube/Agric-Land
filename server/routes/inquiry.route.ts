import {
  createInquiry,
  getInquiresForLandOwner,
  getInquiresForFarmer,
} from "../controllers/inquiry.controller";
import { Router } from "express";
import authMiddleware from "@/middleware/auth.middleware";

const router = Router();

router.post("/create", authMiddleware, createInquiry);
router.get("/landOwner/:landOwnerId", authMiddleware, getInquiresForLandOwner);
router.get("/farmer/:farmerId", authMiddleware, getInquiresForFarmer);

export default router;
