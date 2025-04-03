"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const land_controller_1 = require("../controllers/land.controller");
const express_1 = require("express");
const auth_middleware_1 = __importDefault(require("../middleware/auth.middleware"));
const router = (0, express_1.Router)();
router.post("/create", auth_middleware_1.default, land_controller_1.createLand);
router.get("/:ownerId", auth_middleware_1.default, land_controller_1.getLandsByOwner);
router.put("/status/:landId", auth_middleware_1.default, land_controller_1.changeLandStatus);
router.get("/available/:status", auth_middleware_1.default, land_controller_1.getAvailableLands);
router.delete("/delete/:landId", auth_middleware_1.default, land_controller_1.deleteLand);
exports.default = router;
