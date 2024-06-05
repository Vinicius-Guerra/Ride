import { fakerPT_BR as faker } from "@faker-js/faker";
import { Prisma } from "@prisma/client";
import { prisma } from "../../../prisma/database";

export class CarFactory {
  static build = (data: Partial<Prisma.CarCreateWithoutDriverInput> = {}) => {
    return {
      model: faker.vehicle.model(),
      licensePlate: faker.helpers.fromRegExp("[A-Za-z]{3}-[0-9]{4}"),
      ...data,
    };
  };

  static create = async (
    driverId: number,
    data: Partial<Prisma.CarCreateInput> = {}
  ) => {
    const carData = CarFactory.build(data);

    return await prisma.car.create({ data: { ...carData, driverId } });
  };
}