import { prisma } from "../../../@shared/database/database";
import { deleteCarService } from "../../services";

describe("Car service delete unit tests", () => {
  beforeAll(async () => {
    await prisma.car.deleteMany();
  });

  afterAll(async () => {
    await prisma.car.deleteMany();
    await prisma.driver.deleteMany();
  });

  test("Should be able to delete a Car by id", async () => {
    const driverData = {
      email: "something@mail.com",
      password: "1234",
      firstName: "Chrystian",
      lastName: "Rodolfo",
    };

    const driver = await prisma.driver.create({ data: driverData });

    // SETUP
    const car = {
      model: "Corsa Sedan",
      licensePlate: "AAA-1234",
      driverId: driver.id,
    };
    const createdCar = await prisma.car.create({ data: car });

    await deleteCarService(createdCar.id);

    const cars = await prisma.car.findMany();
    expect(cars).toEqual([]);
  });

  test("Should throw an error if deleting a Car with non existing id", async () => {
    // SETUP
    const nonExistingId = 1000000;

    await expect(deleteCarService(nonExistingId)).rejects.toThrow(
      "Car not found."
    );
  });
});