import { faker }  from "@faker-js/faker";
import { Prisma } from "@prisma/client";
import { prisma } from "../../../prisma/database";
import { hash } from "bcryptjs";
import { CarFactory } from "../../cars/__tests__/factories";

export class DriverFactory {
    static build = async (data: Partial<Prisma.DriverCreateInput> = {}) => {
        const now = Date.now();

        return {
            email: faker.internet.email() + now,
            password: await hash(faker.internet.password(), 10),
            firstName: faker.person.firstName(),
            lastName: faker.person.lastName(),
            ...data,
        };
    };

    static create = async (data: Partial<Prisma.DriverCreateInput> = {}) => {
        const driverData = await DriverFactory.build(data);

        return await prisma.driver.create({ data: driverData });
    };

    static createWithCar = async (data: Partial<Prisma.DriverCreateInput>) => {
        const driverData = await DriverFactory.build(data);
        const driver = await prisma.driver.create({ data: driverData });
        await CarFactory.create(driver.id);

        return driver;
    }
}