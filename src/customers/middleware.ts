import { NextFunction, Request, Response } from "express";
import { prisma } from "../../prisma/database";
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

  export class isCostumerOwner {
    static async execute(req: Request, res: Response, next: NextFunction) {
      const userId = res.locals.decode.id;
      const customerId = req.params.id;

      const customer = await prisma.customer.findFirst({
        where: { id: Number(customerId) },
      });

      if(customer?.id !== userId){
        throw new ApiError("User is not the owner of this customer", 403);
      }

      next();
    }
  }