import { Request, Response } from "express";
import { createCarService, deleteCarService, listCarService, partialUpdateCarService, retrieveCarService } from "./services";

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

export const listCarController = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const listCar = await listCarService();

  return res.status(200).json(listCar);
}

export const retrieveCarController = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const carId = Number(req.params.id);
  const car = await retrieveCarService(carId);

  return res.status(200).json(car);
}

export const partialUpdateCarController = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const payload = req.body;
  const carId = Number(req.params.id);

  const carUpdated = await partialUpdateCarService(payload, carId);

  return res.status(200).json(carUpdated);
};

export const deleteCarController = async (
  req: Request,
  res: Response
): Promise<Response> => {
    const carId = Number(req.params.id);

    await deleteCarService(carId);

    return res.status(209).json();
};