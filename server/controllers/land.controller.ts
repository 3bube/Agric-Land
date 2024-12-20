import Land from "../models/land.model";
// import User from "../models/user.model";
import { Request, Response, NextFunction } from "express";
import { handleError, handleSuccess, handleNotFound } from "../utils/handler";

export const createLand = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const land = await Land.create(req.body);
    handleSuccess(land, res);
  } catch (error) {
    handleError(error, res, next);
  }
};

export const getLandsByOwner = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { ownerId } = req.params;
    const lands = await Land.find({ ownerId });
    handleSuccess(lands, res);
  } catch (error) {
    handleError(error, res, next);
  }
};

export const changeLandStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { landId } = req.params;
    const land = await Land.findById(landId);
    if (!land) {
      handleNotFound(res, "Land not found", next);
      return;
    }
    console.log(req.body);
    land.status = req.body.status;
    await land.save();
    handleSuccess(land, res);
  } catch (error) {
    handleError(error, res, next);
  }
};

export const getAvailableLands = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { status } = req.params;

    if (!status || !["available", "rented", "sold"].includes(status)) {
      return handleError(
        new Error(
          "Invalid status parameter. Must be 'available', 'rented', or 'sold'"
        ),
        res,
        next
      );
    }

    const lands = await Land.find({ status })
      .select("-__v")
      .sort({ createdAt: -1 })
      .lean()
      .populate("ownerId", "name");

    handleSuccess(lands, res);
  } catch (error) {
    console.error("Error in getAvailableLands:", error);
    handleError(error, res, next);
  }
};

export const deleteLand = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { landId } = req.params;
    const land = await Land.findByIdAndDelete(landId);
    if (!land) {
      handleNotFound(res, "Land not found", next);
      return;
    }
    handleSuccess(land, res);
  } catch (error) {
    handleError(error, res, next);
  }
};
