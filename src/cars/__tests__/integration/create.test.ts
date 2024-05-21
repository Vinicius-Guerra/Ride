import { prisma } from "../../../../prisma/database";
import supertest from "supertest";
import { app } from "../../../app";
import { Driver } from "@prisma/client";
import { sign } from "jsonwebtoken";

describe("POST /drivers/:driverId/cars", () => {
  const request = supertest(app);
  const endpointPrefix = "/api/drivers/";
  const endpointSuffix = "/cars";

  let driver: Driver;
  let validDriverToken: string;
  let invalidExpiredToken: string;
  let notDriverToken: string;

  beforeAll(async () => {
    const driverData = {
      email: "driver1@mail.com",
      password: "1234",
      firstName: "Chrystian",
      lastName: "Rodolfo",
    };

    const driver2Data = {
      email: "driver2@mail.com",
      password: "1234",
      firstName: "Chrystian",
      lastName: "Rodolfo",
    };

    driver = await prisma.driver.create({ data: driverData });
    const driver2 = await prisma.driver.create({ data: driver2Data });

    validDriverToken = sign({}, process.env.JWT_SECRET as string, {
      subject: driver.id.toString(),
      expiresIn: process.env.JWT_EXPIRES_IN as string,
    });

    invalidExpiredToken = sign(
      {
        exp: Math.floor(Date.now() / 1000) - 60 * 60,
      },
      process.env.JWT_SECRET as string,
      {
        subject: driver.id.toString(),
      }
    );

    notDriverToken = sign({}, process.env.JWT_SECRET as string, {
      subject: driver2.id.toString(),
      expiresIn: process.env.JWT_EXPIRES_IN as string,
    });
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

    const response = await request
      .post(endpoint)
      .auth(validDriverToken, { type: "bearer" })
      .send(validPayload);

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

    const response = await request
      .post(endpoint)
      .auth(validDriverToken, { type: "bearer" })
      .send(invalidPayload);

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
      .auth(validDriverToken, { type: "bearer" })
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

    const response = await request
      .post(endpoint)
      .auth(validDriverToken, { type: "bearer" })
      .send(invalidModelCar);

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

    const response = await request
      .post(endpoint)
      .auth(validDriverToken, { type: "bearer" })
      .send(invalidModelCar);

    expect(response.body.errors).toBeDefined();

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
      .auth(validDriverToken, { type: "bearer" })
      .send(carWithDuplicatedLicensePlate);

    const expectedResponseBody = {
      error: "This driver already have a car.",
    };

    expect(response.body).toEqual(expectedResponseBody);
    expect(response.statusCode).toBe(409);
  });

  test("Should return an error if creating a car with non existing driver id", async () => {
    // SETUP
    const endpoint = endpointPrefix + 10000 + endpointSuffix;
    const car = {
      model: "Corsa Sedan",
      licensePlate: "AAA-1234",
      driverId: driver.id,
    };

    const response = await request
      .post(endpoint)
      .auth(validDriverToken, { type: "bearer" })
      .send(car);

    const expectedResponseBody = {
      error: "Driver not found.",
    };

    expect(response.body).toEqual(expectedResponseBody);
    expect(response.statusCode).toBe(404);
  });

  /*
  - [x] sem token
  - [x] token com assinatura inválida
  - [x] token expirado
  - [x] token que não é do driver em questão
  */
  test("Should return an error if creating a car without token", async () => {
    // SETUP
    const endpoint = endpointPrefix + driver.id + endpointSuffix;
    const car = {};

    const response = await request.post(endpoint).send(car);

    const expectedResponseBody = {
      error: "Token is required.",
    };

    expect(response.body).toEqual(expectedResponseBody);
    expect(response.statusCode).toBe(401);
  });

  test("Should return an error if creating a car with invalid signature token", async () => {
    // SETUP
    const endpoint = endpointPrefix + driver.id + endpointSuffix;
    const randomToken =
      "invalidToken";

    const car = {
      model: "Corsa Sedan",
      licensePlate: "AAA-1234",
      driverId: driver.id,
    };

    const response = await request
      .post(endpoint)
      .auth(randomToken, { type: "bearer" })
      .send(car);

    const expectedResponseBody = {
      error: "invalid signature",
    };

    expect(response.body).toEqual(expectedResponseBody);
    expect(response.statusCode).toBe(401);
  });

  test("Should return an error if creating a car with expired token", async () => {
    // SETUP
    const endpoint = endpointPrefix + driver.id + endpointSuffix;

    const car = {
      model: "Corsa Sedan",
      licensePlate: "AAA-1234",
      driverId: driver.id,
    };

    const response = await request
      .post(endpoint)
      .auth(invalidExpiredToken, { type: "bearer" })
      .send(car);

    const expectedResponseBody = {
      error: "jwt expired",
    };

    expect(response.body).toEqual(expectedResponseBody);
    expect(response.statusCode).toBe(401);
  });

  test("Should return an error if creating a car without associated driver token", async () => {
    // SETUP
    const endpoint = endpointPrefix + driver.id + endpointSuffix;

    const car = {
      model: "Corsa Sedan",
      licensePlate: "AAA-1234",
      driverId: driver.id,
    };

    const response = await request
      .post(endpoint)
      .auth(notDriverToken, { type: "bearer" })
      .send(car);

    const expectedResponseBody = {
      error: "You dont have permission to perform this action.",
    };

    expect(response.body).toEqual(expectedResponseBody);
    expect(response.statusCode).toBe(403);
  });
});
