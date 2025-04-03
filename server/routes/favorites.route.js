"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const favorites_controller_1 = require("../controllers/favorites.controller");
const express_1 = require("express");
const auth_middleware_1 = __importDefault(require("../middleware/auth.middleware"));
const router = (0, express_1.Router)();
router.post("/add", auth_middleware_1.default, favorites_controller_1.addFavorite);
router.get("/:userId", auth_middleware_1.default, favorites_controller_1.getFavorites);
router.delete("/:userId/:landId", auth_middleware_1.default, favorites_controller_1.removeFavorite);
exports.default = router;
