import { prisma } from "../../prisma/database";
import { Car, CarPayload } from "./interfaces";

export const create = async (payload: CarPayload) => {
    const car = await prisma.car.findUnique({
        where: { licensePlate: payload.licensePlate },
    });

    if (car) {
        throw new Error("License plate already used.");
    }

    const newCar = await prisma.car.create({ data: payload });

    return newCar;
};

export const list = async (): Promise<Array<Car>> => {
    return await prisma.car.findMany();
};

export const retrieve = async (carId: number): Promise<Car> => {
    const car = await prisma.car.findUnique({ where: { id: carId } });

    if (!car) {
        throw new Error("Car not found.");
    }

    return car;
};

export const destroy = async (carId: number) => {
    await retrieve(carId);

    await prisma.car.delete({ where: { id: carId } });
};

export const partialUpdate = async (
    payload: Partial<CarPayload>,
    carId: number
  ) => {
  
    await retrieve(carId);
  
    if (payload.licensePlate) {
      const sameLicensePlateCar = await prisma.car.findUnique({
        where: { licensePlate: payload.licensePlate },
      });
  
      if (sameLicensePlateCar) {
        throw new Error("License plate already used.");
      }
    }
  
    const updatedCar = await prisma.car.update({
      where: { id: carId },
      data: payload,
    });
  
    return updatedCar;
  };
