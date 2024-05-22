import { NextFunction, Request, Response } from "express";
import { ParamType } from "../@shared/interfaces";
import { prisma } from "../../prisma/database";
import { ApiError } from "../errors/api.errors";

export const customerExists = 
(paramType: ParamType) =>
async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { customerId } = paramType === ParamType.URL_PARAM ? req.params : req.body;

  const customer = await prisma.customer.findUnique({
    where: { id: Number(customerId) },
  });

  if (!customer) {
    throw new ApiError("Customer not found.", 404);
  }

  return next();
};