import { prisma } from "../../prisma/database";
import { DriverAlreadyHaveCarError } from "../drivers/errors";
import { CarNotFoundError, LicensePlateAlreadyUsedError } from "./errors";

import { CarPayload, Car } from "./interfaces";

const isLicensePlateUnique = async (licensePlate: string) => {
  const carWithDuplicatedLicensePlate = await prisma.car.findUnique({
    where: { licensePlate: licensePlate },
  });

  if (carWithDuplicatedLicensePlate) {
    throw new LicensePlateAlreadyUsedError();
  }
};

const isDriverUnique = async (driverId: number) => {
  const carWithDuplicatedDriver = await prisma.car.findUnique({
    where: { driverId: driverId },
  });

  if (carWithDuplicatedDriver) {
    throw new DriverAlreadyHaveCarError();
  }
};

export const createCarService = async (payload: CarPayload): Promise<Car> => {
  await isLicensePlateUnique(payload.licensePlate);
  await isDriverUnique(payload.driverId);

  const newCar = await prisma.car.create({ data: payload });

  return newCar;
};

export const listCarService = async (): Promise<Array<Car>> => {
  return await prisma.car.findMany();
};

export const retrieveCarService = async (carId: number): Promise<Car> => {
  const car = await prisma.car.findUnique({ where: { id: carId } });

  if (!car) {
    throw new CarNotFoundError();
  }

  return car;
};

export const deleteCarService = async (carId: number) => {
  await retrieveCarService(carId);

  await prisma.car.delete({ where: { id: carId } });
};

export const partialUpdateCarService = async (
  payload: Partial<CarPayload>,
  carId: number
) => {
  await retrieveCarService(carId);

  if (payload.licensePlate) {
    await isLicensePlateUnique(payload.licensePlate);
  }

  if (payload.driverId) {
    await isDriverUnique(payload.driverId);
  }

  const updatedCar = await prisma.car.update({
    where: { id: carId },
    data: payload,
  });

  return updatedCar;
  // return { id: carId, ...payload };
};