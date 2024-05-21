import { Request, Response } from "express";
import { createCustomerService } from "./services";

export const createCustomerController = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const createdCustomer = await createCustomerService({
    ...req.body,
  });

  return res.status(201).json(createdCustomer);
};