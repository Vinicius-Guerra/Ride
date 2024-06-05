import { Request, Response } from "express";
import { createDriverService, deleteDriverService, listDriverService, listOneDriverService, updateDriverService } from "./services";

export const createDriverController = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const createdDriver = await createDriverService({
    ...req.body,
  });

  return res.status(201).json(createdDriver);
};

export const listDriverController = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { paginationData } = res.locals;

  const drivers = await listDriverService(paginationData);

  return res.status(200).json(drivers);
};

export const listOneDriverController = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const id = Number(req.params.id);
  const driver = await listOneDriverService(id);

  return res.status(200).json(driver);
};

export const updateDriverController = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const id = Number(req.params.id);

  const driverUpdate = await updateDriverService(id, req.body);

  return res.status(200).json(driverUpdate);
}

export const deleteDriverController = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const id = Number(req.params.id);

  const deleteDriver = await deleteDriverService(id);

  return res.status(204).json();
};