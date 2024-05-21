import { prisma } from "../../../../prisma/database";
import { retrieve } from "../../services";

describe("Car service retrieve unit tests", () => {
  beforeEach(async () => {
    await prisma.car.deleteMany();
  });

  test("Should be able to retrieve a Car by id", async () => {
    const car = {
      model: "Corsa Sedan",
      licensePlate: "AAA-1234",
    };
    const createdCar = await prisma.car.create({ data: car });

    const receivedValue = await retrieve(createdCar.id);
    const expectedValue = {
      id: createdCar.id,
      model: car.model,
      licensePlate: car.licensePlate,
    };

    expect(receivedValue).toEqual(expectedValue);
  });

  test("Should throw an error if retrieving a Car with non existing id", async () => {

    const nonExistingId = 1000000;

    await expect(retrieve(nonExistingId)).rejects.toThrow("Car not found.");
  });
});