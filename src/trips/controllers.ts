import { Request, Response } from "express";
import { createTripService } from "./services";

export const createTripController = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const createdTrip = await createTripService({
    ...req.body,
  });

  return res.status(201).json(createdTrip);
};