import { prisma } from "../../../@shared/database/database";
import { DriverFactory } from "../../../drivers/__tests__/factories";
import { Driver } from "../../../drivers/interfaces";
import { retrieveCarService } from "../../services";

describe("Car service retrieve unit tests", () => {
  let driver: Driver;

  beforeAll(async () => {
    driver = await DriverFactory.create();
  });

  beforeEach(async () => {
    await prisma.car.deleteMany();
  });

  afterAll(async () => {
    await prisma.car.deleteMany();
    await prisma.driver.deleteMany();
  });

  test("Should be able to retrieve a Car by id", async () => {
    /* 
      TODO:
      - Utilizar DriverFactory
    */

    const car = {
      model: "Corsa Sedan",
      licensePlate: "AAA-1234",
      driverId: driver.id,
    };
    const createdCar = await prisma.car.create({ data: car });

    const receivedValue = await retrieveCarService(createdCar.id);
    const expectedValue = {
      id: createdCar.id,
      model: car.model,
      licensePlate: car.licensePlate,
      driverId: driver.id,
    };

    expect(receivedValue).toEqual(expectedValue);
  });

  test("Should throw an error if retrieving a Car with non existing id", async () => {
    // SETUP
    const nonExistingId = 1000000;

    await expect(retrieveCarService(nonExistingId)).rejects.toThrow(
      "Car not found."
    );
    // expect(async () => await retrieve(nonExistingId)).rejects.toThrow(
    //   "Car not found."
    // );
  });
});