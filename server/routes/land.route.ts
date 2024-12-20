import {
  createLand,
  getLandsByOwner,
  changeLandStatus,
  deleteLand,
  getAvailableLands,
} from "../controllers/land.controller";
import { Router } from "express";
import authMiddleware from "../middleware/auth.middleware";

const router = Router();

router.post("/create", authMiddleware, createLand);
router.get("/:ownerId", authMiddleware, getLandsByOwner);
router.put("/status/:landId", authMiddleware, changeLandStatus);
router.get("/available/:status", authMiddleware, getAvailableLands);
router.delete("/delete/:landId", authMiddleware, deleteLand);
export default router;
