import { Request, Response } from "express";
import { createDriverService } from "./services";

export const createDriverController = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const createdDriver = await createDriverService({
    ...req.body,
  });

  return res.status(201).json(createdDriver);
};