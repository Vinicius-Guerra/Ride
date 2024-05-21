import { prisma } from "../../../../prisma/database";
import { partialUpdate } from "../../services";

describe("Car service partial update unit tests", () => {
  beforeAll(async () => {
    await prisma.car.deleteMany();
  });
  beforeEach(async () => {
    await prisma.car.deleteMany();
  });

  test("Should be able to partial update a Car by id", async () => {
    const car = {
      model: "Corsa Sedan",
      licensePlate: "AAA-1234",
    };
    const createdCar = await prisma.car.create({ data: car });

    const toUpdatePayload = {
      model: "Model ABCDE",
      licensePlate: "BBB-2222",
    };

    const receivedValue = await partialUpdate(toUpdatePayload, createdCar.id);
    const expecteValue = {
      id: createdCar.id,
      model: toUpdatePayload.model,
      licensePlate: toUpdatePayload.licensePlate,
    };

    expect(receivedValue).toEqual(expecteValue);

    const updatedCar = await prisma.car.findUnique({
      where: { id: createdCar.id },
    });
    expect(updatedCar).toEqual(expecteValue);
  });

  test("Should throw an error if partial updating a Car with non existing id", async () => {
    const nonExistingId = 1000000;

    await expect(partialUpdate({}, nonExistingId)).rejects.toThrow(
      "Car not found."
    );
  });

  test("Should throw an error if partial updating a Car with duplicated license plate", async () => {
    const car1 = {
      model: "Corsa Sedan",
      licensePlate: "AAA-1111",
    };
    const car2 = {
      model: "Fusca",
      licensePlate: "BBB-5555",
    };
    const createdCar1 = await prisma.car.create({ data: car1 });
    const createdCar2 = await prisma.car.create({ data: car2 });

    const toUpdatePayload = {
      licensePlate: car2.licensePlate,
    };

    await expect(
      partialUpdate(toUpdatePayload, createdCar1.id)
    ).rejects.toThrow("License plate already used.");

  });
});