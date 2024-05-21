import { Driver } from "@prisma/client";
import { prisma } from "../../../../prisma/database";
import { partialUpdateCarService } from "../../services";

describe("Car service partial update unit tests", () => {
  let driver1: Driver;
  let driver2: Driver;

  beforeAll(async () => {
    const driver1Data = {
      email: "something@mail.com",
      password: "1234",
      firstName: "Chrystian",
      lastName: "Rodolfo",
    };
    const driver2Data = {
      email: "something2@mail.com",
      password: "1234",
      firstName: "Chrystian",
      lastName: "Rodolfo",
    };

    driver1 = await prisma.driver.create({ data: driver1Data });
    driver2 = await prisma.driver.create({ data: driver2Data });
  });

  beforeEach(async () => {
    await prisma.car.deleteMany();
  });

  afterAll(async () => {
    await prisma.car.deleteMany();
    await prisma.driver.deleteMany();
  });

  test("Should be able to partial update a Car by id", async () => {
    // SETUP
    const car = {
      model: "Corsa Sedan",
      licensePlate: "AAA-1234",
      driverId: driver1.id,
    };
    const createdCar = await prisma.car.create({ data: car });

    const toUpdatePayload = {
      model: "Model ABCDE",
      licensePlate: "BBB-2222",
    };

    const receivedValue = await partialUpdateCarService(
      toUpdatePayload,
      createdCar.id
    );
    const expecteValue = {
      id: createdCar.id,
      model: toUpdatePayload.model,
      licensePlate: toUpdatePayload.licensePlate,
      driverId: driver1.id,
    };

    expect(receivedValue).toEqual(expecteValue);

    const updatedCar = await prisma.car.findUnique({
      where: { id: createdCar.id },
    });
    expect(updatedCar).toEqual(expecteValue);
  });

  test("Should throw an error if partial updating a Car with non existing id", async () => {
    // SETUP
    const nonExistingId = 1000000;

    await expect(partialUpdateCarService({}, nonExistingId)).rejects.toThrow(
      "Car not found."
    );
  });

  test("Should throw an error if partial updating a Car with duplicated license plate", async () => {
    // SETUP
    const car1 = {
      model: "Corsa Sedan",
      licensePlate: "AAA-1111",
      driverId: driver1.id,
    };
    const car2 = {
      model: "Fusca",
      licensePlate: "BBB-5555",
      driverId: driver2.id,
    };
    const createdCar1 = await prisma.car.create({ data: car1 });
    const createdCar2 = await prisma.car.create({ data: car2 });

    const toUpdatePayload = {
      licensePlate: car2.licensePlate,
    };

    await expect(
      partialUpdateCarService(toUpdatePayload, createdCar1.id)
    ).rejects.toThrow("License plate already used.");

    // TODO: Avaliar se registro correspondente ao id do dado enviado para update nao foi alterado
    const receivedCar1 = await prisma.car.findUnique({
      where: { id: createdCar1.id },
    });

    expect(receivedCar1).toEqual(createdCar1);
  });

  test("Should throw an error if partial updating a Car with duplicated driver id", async () => {
    // SETUP
    const car1 = {
      model: "Corsa Sedan",
      licensePlate: "AAA-1111",
      driverId: driver1.id,
    };
    const car2 = {
      model: "Fusca",
      licensePlate: "BBB-5555",
      driverId: driver2.id,
    };
    const createdCar1 = await prisma.car.create({ data: car1 });
    const createdCar2 = await prisma.car.create({ data: car2 });

    const toUpdatePayload = {
      driverId: driver2.id,
    };

    await expect(
      partialUpdateCarService(toUpdatePayload, createdCar1.id)
    ).rejects.toThrow("This driver already have a car.");

    // TODO: Avaliar se registro correspondente ao id do dado enviado para update nao foi alterado
    const receivedCar1 = await prisma.car.findUnique({
      where: { id: createdCar1.id },
    });

    expect(receivedCar1).toEqual(createdCar1);
  });
});
