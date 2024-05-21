import { Request, Response } from "express";
import { createCarService } from "./services";

export const createCarController = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const createdCar = await createCarService({
    ...req.body,
    driverId: Number(req.params.driverId),
  });

  return res.status(201).json(createdCar);
};