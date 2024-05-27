import { Request, Response } from "express";
import { createTripService, listTripService } from "./services";

export const createTripController = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const createdTrip = await createTripService({
    ...req.body,
  });

  return res.status(201).json(createdTrip);
};

export const listTripController = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { paginationData } = res.locals;

  const trips = await listTripService(paginationData);

  return res.status(200).json(trips);
};