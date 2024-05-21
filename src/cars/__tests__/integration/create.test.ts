import { prisma } from "../../../../prisma/database";
import supertest from "supertest";
import { app, initApp } from "../../../app";
import { Driver } from "@prisma/client";

describe("POST /drivers/:driverId/cars", () => {
  const request = supertest(initApp);
  const endpointPrefix = "/api/drivers/";
  const endpointSuffix = "/cars";

  let driver: Driver;

  beforeAll(async () => {
    const driverData = {
      email: "something@mail.com",
      password: "1234",
      firstName: "Chrystian",
      lastName: "Rodolfo",
    };

    driver = await prisma.driver.create({ data: driverData });
  });

  beforeEach(async () => {
    await prisma.car.deleteMany();
  });

  afterAll(async () => {
    await prisma.car.deleteMany();
    await prisma.driver.deleteMany();
  });

  test("Should be able to create a car", async () => {
    // "/api/drivers/100/cars"
    const endpoint = endpointPrefix + driver.id + endpointSuffix;
    const validPayload = {
      model: "Corsa Sedan",
      licensePlate: "AAA-1234",
    };

    const response = await request.post(endpoint).send(validPayload);
    // console.log(response);

    const expectedResponseBody = {
      id: expect.any(Number),
      model: validPayload.model,
      licensePlate: validPayload.licensePlate,
      driverId: driver.id,
    };

    expect(response.body).toEqual(expectedResponseBody);
    expect(response.status).toBe(201);
  });

  test("Should return an error if creating a car without required keys", async () => {
    // SETUP
    const endpoint = endpointPrefix + driver.id + endpointSuffix;
    const invalidPayload = {};
    const response = await request.post(endpoint).send(invalidPayload);

    const requiredKeys = ["model", "licensePlate"];
    const receivedKeys = Object.keys(response.body.errors);
    expect(receivedKeys).toEqual(requiredKeys);

    requiredKeys.forEach((requiredKey) => {
      expect(response.body.errors[requiredKey]).toContain("Required");
    });
  });

  test("Should return an error if creating a car with duplicated license plate", async () => {
    // SETUP
    const endpoint = endpointPrefix + driver.id + endpointSuffix;
    const car1 = {
      model: "Corsa Sedan",
      licensePlate: "AAA-1234",
      driverId: driver.id,
    };
    await prisma.car.create({ data: car1 });

    const carWithDuplicatedLicensePlate = {
      model: "Fusca",
      licensePlate: car1.licensePlate,
    };

    const response = await request
      .post(endpoint)
      .send(carWithDuplicatedLicensePlate);

    const expectedResponseBody = {
      error: "License plate already used.",
    };

    expect(response.body).toEqual(expectedResponseBody);
    expect(response.statusCode).toBe(409);
  });

  test("Should return an error if creating a car with model field more than 100 characters", async () => {
    // SETUP
    const endpoint = endpointPrefix + driver.id + endpointSuffix;
    const invalidModelCar = {
      model:
        "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
      licensePlate: "AAA-1234",
    };

    const response = await request.post(endpoint).send(invalidModelCar);

    expect(response.body.errors).toBeDefined();

    const expectedResponseBody = {
      errors: { model: ["String must contain at most 100 character(s)"] },
    };

    expect(response.body).toEqual(expectedResponseBody);
    expect(response.statusCode).toBe(400);
  });

  test("Should return an error if creating a car with licensePlate field invalid format", async () => {
    // SETUP
    const endpoint = endpointPrefix + driver.id + endpointSuffix;
    const invalidModelCar = {
      model: "Fusca",
      licensePlate: "BBBBBB-12345678",
    };

    const response = await request.post(endpoint).send(invalidModelCar);

    expect(response.body.errors).toBeDefined();

    console.log(response.body.errors);
    const expectedResponseBody = {
      errors: {
        licensePlate: [
          "License plate has an invalid format. It must be in `AAA-1111` format.",
        ],
      },
    };

    expect(response.body).toEqual(expectedResponseBody);
    expect(response.statusCode).toBe(400);
  });

  test("Should return an error if creating a car with duplicated driver id", async () => {
    // SETUP
    const endpoint = endpointPrefix + driver.id + endpointSuffix;
    const car1 = {
      model: "Corsa Sedan",
      licensePlate: "AAA-1234",
      driverId: driver.id,
    };
    await prisma.car.create({ data: car1 });

    const carWithDuplicatedLicensePlate = {
      model: "Fusca",
      licensePlate: "ZZZ-2222",
    };

    const response = await request
      .post(endpoint)
      .send(carWithDuplicatedLicensePlate);

    const expectedResponseBody = {
      error: "This driver already have a car.",
    };

    expect(response.body).toEqual(expectedResponseBody);
    expect(response.statusCode).toBe(409);
  });
});