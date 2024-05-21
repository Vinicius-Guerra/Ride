import { prisma } from "../../prisma/database";
import { ApiError } from "../errors/api.errors";
import { CarPayload, Car } from "./interfaces";

export const createCarService = async (payload: CarPayload): Promise<Car> => {
  const carWithDuplicatedLicensePlate = await prisma.car.findUnique({
    where: { licensePlate: payload.licensePlate },
  });

  if (carWithDuplicatedLicensePlate) {
    throw new ApiError("License plate already used.", 409);
  }

  const carWithDuplicatedDriver = await prisma.car.findUnique({
    where: { driverId: payload.driverId },
  });

  if (carWithDuplicatedDriver) {
    throw new ApiError("This driver already have a car.", 409);
  }

  const newCar = await prisma.car.create({ data: payload });

  return newCar;
};

export const listCarService = async (): Promise<Array<Car>> => {
  return await prisma.car.findMany();
};

export const retrieveCarService = async (carId: number): Promise<Car> => {
  const car = await prisma.car.findUnique({ where: { id: carId } });

  if (!car) {
    throw new ApiError("Car not found.", 404);
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
    const sameLicensePlateCar = await prisma.car.findUnique({
      where: { licensePlate: payload.licensePlate },
    });

    if (sameLicensePlateCar) {
      throw new ApiError("License plate already used.", 409);
    }
  }

  if (payload.driverId) {
    const carWithDuplicatedDriver = await prisma.car.findUnique({
      where: { driverId: payload.driverId },
    });

    if (carWithDuplicatedDriver) {
      throw new ApiError("This driver already have a car.", 409);
    }
  }

  const updatedCar = await prisma.car.update({
    where: { id: carId },
    data: payload,
  });

  return updatedCar;
};