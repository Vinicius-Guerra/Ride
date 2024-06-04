import { Request, Response } from "express";
import { login, loginCustomer } from "./services";

export const sessionController = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const token = await login(req.body);
  return res.status(200).json(token);
};

export const sessionCustomerController = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const token = await loginCustomer(req.body);
  return res.status(200).json(token);
};