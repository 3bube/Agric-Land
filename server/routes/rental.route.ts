import express from "express";
import {
  createRental,
  getRentals,
  signRental,
  updateRentalStatus,
  updatePaymentStatus,
} from "../controllers/rental.controller";
import authMiddleware from "../middleware/auth.middleware";
const router = express.Router();

router.use(authMiddleware);

// Create rental agreement
router.post("/", createRental);

// Sign rental agreement (for farmer)
router.put("/:rentalId/sign", signRental);

// Get rentals for user
router.get("/", getRentals);

// Update rental status
router.put("/:rentalId/status", updateRentalStatus);

// Update payment status
router.put("/:rentalId/payment-status", updatePaymentStatus);

export default router;
