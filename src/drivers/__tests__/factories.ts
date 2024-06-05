import { fakerPT_BR as faker } from "@faker-js/faker";
import { Prisma } from "@prisma/client";
import { prisma } from "../../@shared/database/database";
import { CarFactory } from "../../cars/__tests__/factories";

// FACTORY -> Padrão de Projeto (Design Pattern)
export class DriverFactory {
  static build = (data: Partial<Prisma.DriverCreateInput> = {}) => {
    const now = Date.now();
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();

    return {
      email: now + faker.internet.email({ firstName, lastName }),
      password: faker.internet.password(),
      firstName: firstName,
      lastName: lastName,
      ...data,
    };
  };

  static create = async (data: Partial<Prisma.DriverCreateInput> = {}) => {
    const driverData = DriverFactory.build(data);

    return await prisma.driver.create({ data: driverData });
  };

  static createWithCar = async (
    data: Partial<Prisma.DriverCreateInput> = {}
  ) => {
    const driverData = DriverFactory.build(data);
    const driver = await prisma.driver.create({ data: driverData });
    await CarFactory.create(driver.id);

    return driver;
  };
}