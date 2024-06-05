import { Request, Response } from "express";
import { createCustomerService, deleteCustomerService, listCustomerService, listOneCustomerService, updateCustomerService } from "./services";

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

export const listOneCustomerController = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const id = Number(req.params.id);
  const customer = await listOneCustomerService(id);

  return res.status(200).json(customer);
};

export const updateCustomerController = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const id = Number(req.params.id);

  const customerUpdate = await updateCustomerService(id, req.body);

  return res.status(200).json(customerUpdate);
}

export const deleteCustomerController = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const id = Number(req.params.id);

  const deleteCustomer = await deleteCustomerService(id);

  return res.status(204).json();
};