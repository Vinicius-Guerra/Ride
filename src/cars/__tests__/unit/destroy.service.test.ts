import { prisma } from "../../../../prisma/database";
import { destroy } from "../../services";

describe("Car service delete unit tests", () => {
  beforeAll(async () => {
    await prisma.car.deleteMany();
  });

  test("Should be able to delete a Car by id", async () => {
    const car = {
      model: "Corsa Sedan",
      licensePlate: "AAA-1234",
    };
    const createdCar = await prisma.car.create({ data: car });

    await destroy(createdCar.id);

    const cars = await prisma.car.findMany();
    expect(cars).toEqual([]);
    // OU
    // const car = await prisma.car.findUnique({ where: { id: createdCar.id } });
    // expect(car).toBeFalsy();
  });

  test("Should throw an error if deleting a Car with non existing id", async () => {
    const nonExistingId = 1000000;

    await expect(destroy(nonExistingId)).rejects.toThrow("Car not found.");
  });
});