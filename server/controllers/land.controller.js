"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteLand = exports.getAvailableLands = exports.changeLandStatus = exports.getLandsByOwner = exports.createLand = void 0;
const land_model_1 = __importDefault(require("../models/land.model"));
const handler_1 = require("../utils/handler");
const createLand = async (req, res, next) => {
    try {
        const land = await land_model_1.default.create(req.body);
        (0, handler_1.handleSuccess)(land, res);
    }
    catch (error) {
        (0, handler_1.handleError)(error, res, next);
    }
};
exports.createLand = createLand;
const getLandsByOwner = async (req, res, next) => {
    try {
        const { ownerId } = req.params;
        const lands = await land_model_1.default.find({ ownerId });
        (0, handler_1.handleSuccess)(lands, res);
    }
    catch (error) {
        (0, handler_1.handleError)(error, res, next);
    }
};
exports.getLandsByOwner = getLandsByOwner;
const changeLandStatus = async (req, res, next) => {
    try {
        const { landId } = req.params;
        const land = await land_model_1.default.findById(landId);
        if (!land) {
            (0, handler_1.handleNotFound)(res, "Land not found", next);
            return;
        }
        console.log(req.body);
        land.status = req.body.status;
        await land.save();
        (0, handler_1.handleSuccess)(land, res);
    }
    catch (error) {
        (0, handler_1.handleError)(error, res, next);
    }
};
exports.changeLandStatus = changeLandStatus;
const getAvailableLands = async (req, res, next) => {
    try {
        const { status } = req.params;
        if (!status || !["available", "rented", "sold"].includes(status)) {
            return (0, handler_1.handleError)(new Error("Invalid status parameter. Must be 'available', 'rented', or 'sold'"), res, next);
        }
        const lands = await land_model_1.default.find({ status })
            .select("-__v")
            .sort({ createdAt: -1 })
            .lean()
            .populate("ownerId", "name");
        (0, handler_1.handleSuccess)(lands, res);
    }
    catch (error) {
        console.error("Error in getAvailableLands:", error);
        (0, handler_1.handleError)(error, res, next);
    }
};
exports.getAvailableLands = getAvailableLands;
const deleteLand = async (req, res, next) => {
    try {
        const { landId } = req.params;
        const land = await land_model_1.default.findByIdAndDelete(landId);
        if (!land) {
            (0, handler_1.handleNotFound)(res, "Land not found", next);
            return;
        }
        (0, handler_1.handleSuccess)(land, res);
    }
    catch (error) {
        (0, handler_1.handleError)(error, res, next);
    }
};
exports.deleteLand = deleteLand;
