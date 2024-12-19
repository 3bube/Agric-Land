import { Request, Response, NextFunction } from "express";
import Favorite from "../models/favorites.model";
import { handleError, handleSuccess, handleNotFound } from "../utils/handler";

export const addFavorite = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId, landId } = req.body;
    const favorite = await Favorite.create({ user: userId, land: landId });
    handleSuccess(favorite, res);
  } catch (error) {
    handleError(error, res, next);
  }
};

export const getFavorites = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.params;
    const favorites = await Favorite.find({ user: userId })
      .populate({
        path: "land",
        select: "title location size rentalCost image description features status",
      })
      .sort({ createdAt: -1 });
    handleSuccess(favorites, res);
  } catch (error) {
    handleError(error, res, next);
  }
};

export const removeFavorite = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId, landId } = req.params;
    const favorite = await Favorite.findOneAndDelete({
      user: userId,
      land: landId,
    });
    if (!favorite) {
      return handleNotFound(res, "Favorite not found", next);
    }
    handleSuccess(favorite, res);
  } catch (error) {
    handleError(error, res, next);
  }
};
