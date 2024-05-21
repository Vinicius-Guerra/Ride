import { Request, Response } from "express";
import { create } from "./services";

export const createController = async (req: Request, res: Response): Promise<Response> => {
  const createdCar = await create(req.body);

  return res.status(201).json(createdCar);
};