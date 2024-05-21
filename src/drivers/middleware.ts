import { NextFunction, Request, Response } from "express";
import { prisma } from "../../prisma/database";
import { ApiError } from "../errors/api.errors";

export const driverExists = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { driverId } = req.params;

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
