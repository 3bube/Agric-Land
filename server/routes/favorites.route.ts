import {
  addFavorite,
  getFavorites,
  removeFavorite,
} from "../controllers/favorites.controller";
import { Router } from "express";
import authMiddleware from "../middleware/auth.middleware";

const router = Router();

router.post("/add", authMiddleware, addFavorite);
router.get("/:userId", authMiddleware, getFavorites);
router.delete("/:userId/:landId", authMiddleware, removeFavorite);

export default router;
