import { Request, Response } from "express";
import { createCustomerService, listCustomerService } from "./services";

export const createCustomerController = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const createdCustomer = await createCustomerService({
    ...req.body,
  });

  return res.status(201).json(createdCustomer);
};

export const listCustomerController = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const customers = await listCustomerService();

  return res.status(200).json(customers);
};