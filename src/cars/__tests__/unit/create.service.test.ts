import { Driver } from "@prisma/client";
import { prisma } from "../../../@shared/database/database";
import { createCarService } from "../../services";
import { DriverFactory } from "../../../drivers/__tests__/factories";

describe("Car service create unit tests", () => {
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

  test("Should be able to create a Car", async () => {
    // SETUP
    const validTestCar = {
      model: "Corsa Sedan",
      licensePlate: "AAA-1234",
      driverId: driver.id,
    };

    const receivedValue = await createCarService(validTestCar);

    const expectedValue = {
      id: expect.any(Number),
      model: validTestCar.model,
      licensePlate: validTestCar.licensePlate,
      driverId: driver.id,
    };

    expect(receivedValue).toEqual(expectedValue);

    const createdCar = await prisma.car.findUnique({
      where: { id: receivedValue.id },
    });

    expect(createdCar).toBeTruthy();
  });

  test("Should throw an error if creating a Car with duplicated license plate", async () => {
    // SETUP
    const car = {
      model: "Corsa Sedan",
      licensePlate: "AAA-1234",
      driverId: driver.id,
    };

    await prisma.car.create({ data: car });

    const carWithDuplicatedLicensePlate = {
      model: "Gol",
      licensePlate: car.licensePlate,
      driverId: driver.id,
    };

    await expect(
      createCarService(carWithDuplicatedLicensePlate)
    ).rejects.toThrow("License plate already used.");
  });

  test("Should throw an error if creating a Car with duplicated driver id", async () => {
    // SETUP
    const car = {
      model: "Corsa Sedan",
      licensePlate: "AAA-1234",
      driverId: driver.id,
    };

    await prisma.car.create({ data: car });

    const carWithDuplicatedLicensePlate = {
      model: "Gol",
      licensePlate: "BBB-1234",
      driverId: driver.id,
    };

    // await create(carWithDuplicatedLicensePlate);

    await expect(
      createCarService(carWithDuplicatedLicensePlate)
    ).rejects.toThrow("This driver already have a car.");
  });
});