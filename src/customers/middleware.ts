import { NextFunction, Request, Response } from "express";
import { prisma } from "../@shared/database/database";
import { ApiError } from "../@shared/errors/api.errors";
import { ParamType } from "../@shared/interfaces";

export const customerExists =
  (paramType: ParamType) =>
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      const { customerId } =
        paramType === ParamType.URL_PARAM ? req.params : req.body;

      const customer = await prisma.customer.findUnique({
        where: { id: Number(customerId) },
      });

      if (!customer) {
        throw new ApiError("Customer not found.", 404);
      }

      return next();
    };

export class isCustomerOwner {
  static async execute(req: Request, res: Response, next: NextFunction) {

    const id = res.locals.decoded.id;
    const customerId = Number(req.params.id);

    if (isNaN(customerId)) {
      throw new ApiError("Invalid customer ID", 400);
    }

    const customer = await prisma.customer.findFirst({
      where: { id: customerId },
    });

    if (!customer) {
      throw new ApiError("Customer not found", 404);
    }

    if (customer.id !== customerId) {
      throw new ApiError("User is not the owner of this customer", 403);
    }

    next();
  }
}
