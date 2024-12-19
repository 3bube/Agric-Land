import Inquiry from "../models/Inquiry.model";
import Land from "../models/land.model";
import { Request, Response, NextFunction } from "express";
import {
  handleSuccess,
  handleError,
  handleCreation,
  handleNotFound,
} from "@/utils/handler";

export const createInquiry = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const inquiry = await Inquiry.create(req.body);
    handleCreation(inquiry, res);
  } catch (error) {
    handleError(error, res, next);
  }
};

export const getInquiresForFarmer = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const farmerId = req.params.farmerId;
    const inquiries = await Inquiry.find({ farmer: farmerId }).populate({
      path: "land",
      populate: {
        path: "ownerId",
        select: "name",
      },
    });

    if (!inquiries) {
      handleNotFound(res, "Inquiries not found", next);
      return;
    }

    handleSuccess(inquiries, res);
  } catch (error) {
    handleError(error, res, next);
  }
};

export const getInquiresForLandOwner = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const landOwnerId = req.params.landOwnerId;
    const lands = await Land.find({ ownerId: landOwnerId });
    const inquiries = await Inquiry.find({
      land: { $in: lands.map((land) => land._id) },
    });

    if (!inquiries) {
      handleNotFound(res, "Inquiries not found", next);
      return;
    }

    handleSuccess(inquiries, res);
  } catch (error) {
    handleError(error, res, next);
  }
};
