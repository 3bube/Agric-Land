"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeFavorite = exports.getFavorites = exports.addFavorite = void 0;
const favorites_model_1 = __importDefault(require("../models/favorites.model"));
const handler_1 = require("../utils/handler");
const addFavorite = async (req, res, next) => {
    try {
        const { userId, landId } = req.body;
        const favorite = await favorites_model_1.default.create({ user: userId, land: landId });
        (0, handler_1.handleSuccess)(favorite, res);
    }
    catch (error) {
        (0, handler_1.handleError)(error, res, next);
    }
};
exports.addFavorite = addFavorite;
const getFavorites = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const favorites = await favorites_model_1.default.find({ user: userId })
            .populate({
            path: "land",
            select: "title location size rentalCost image description features status",
        })
            .sort({ createdAt: -1 });
        (0, handler_1.handleSuccess)(favorites, res);
    }
    catch (error) {
        (0, handler_1.handleError)(error, res, next);
    }
};
exports.getFavorites = getFavorites;
const removeFavorite = async (req, res, next) => {
    try {
        const { userId, landId } = req.params;
        const favorite = await favorites_model_1.default.findOneAndDelete({
            user: userId,
            land: landId,
        });
        if (!favorite) {
            return (0, handler_1.handleNotFound)(res, "Favorite not found", next);
        }
        (0, handler_1.handleSuccess)(favorite, res);
    }
    catch (error) {
        (0, handler_1.handleError)(error, res, next);
    }
};
exports.removeFavorite = removeFavorite;
