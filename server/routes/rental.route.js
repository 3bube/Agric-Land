"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const rental_controller_1 = require("../controllers/rental.controller");
const auth_middleware_1 = __importDefault(require("../middleware/auth.middleware"));
const router = express_1.default.Router();
router.use(auth_middleware_1.default);
// Create rental agreement
router.post("/", rental_controller_1.createRental);
// Sign rental agreement (for farmer)
router.put("/:rentalId/sign", rental_controller_1.signRental);
// Get rentals for user
router.get("/", rental_controller_1.getRentals);
// Update rental status
router.put("/:rentalId/status", rental_controller_1.updateRentalStatus);
// Update payment status
router.put("/:rentalId/payment-status", rental_controller_1.updatePaymentStatus);
exports.default = router;
