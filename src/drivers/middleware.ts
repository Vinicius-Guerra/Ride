import { NextFunction, Request, Response } from "express";
import { prisma } from "../prisma/database";
import { ApiError } from "../@shared/errors/api.errors";
import { ParamType } from "../@shared/interfaces/enum.interfaces";

export const driverExists = 
(paramType: ParamType) =>
async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { driverId } = paramType === ParamType.URL_PARAM ? req.params : req.body;

  const driver = await prisma.driver.findUnique({
    where: { id: Number(driverId) },
  });

  if (!driver) {
    throw new ApiError("Driver not found.", 404);
  }

  return next();
};

  export const isAccountOwner = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const { sub } = res.locals.decoded;
    const { driverId } = req.params;
  
    if (sub !== driverId) {
      throw new ApiError("You dont have permission to perform this action.", 403);
    }
  
    return next();
  };

  export const isAccountDriverOwner = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const { sub } = res.locals.decoded;
    const { driverId } = req.params;
  
    if (sub.id !== driverId) {
      throw new ApiError("You dont have permission to perform this action.", 403);
    }
  
    return next();
  };