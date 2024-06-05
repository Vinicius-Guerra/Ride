import { fakerPT_BR as faker } from "@faker-js/faker";
import { Prisma } from "@prisma/client";
import { prisma } from "../../@shared/database/database";

export class CustomerFactory {
  static build = (data: Partial<Prisma.CustomerCreateInput> = {}) => {
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

  static create = async (data: Partial<Prisma.CustomerCreateInput> = {}) => {
    const driverData = CustomerFactory.build(data);

    return await prisma.customer.create({ data: driverData });
  };
}