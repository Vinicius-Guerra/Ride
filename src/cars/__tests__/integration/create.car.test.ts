import { prisma } from "../../../../prisma/database";
import supertest from "supertest";
import { app } from "../../../app";
import { Driver } from "@prisma/client";
import { sign } from "jsonwebtoken";
import { DriverFactory } from "../../../drivers/__tests__/factories";
import { TokenFactory } from "../../../session/__tests__/factories";
import { parsedEnv } from "../../../@shared/configs";

describe("POST /drivers/:driverId/cars", () => {
  const request = supertest(app);
  const endpointPrefix = "/api/drivers/";
  const endpointSuffix = "/cars";

  let driver: Driver;
  let validDriverToken: string;
  let invalidExpiredToken: string;
  let notDriverToken: string;

  beforeAll(async () => {
    driver = await DriverFactory.create();
    validDriverToken = TokenFactory.create(driver.id);

    const driver2 = await DriverFactory.create();
    notDriverToken = TokenFactory.create(driver2.id);

    invalidExpiredToken = sign(
      {
        exp: Math.floor(Date.now() / 1000) - 60 * 60,
      },
      parsedEnv.JWT_SECRET,
      {
        subject: driver.id.toString(),
      }
    );
  });

  beforeEach(async () => {
    await prisma.car.deleteMany();
  });

  afterAll(async () => {
    await prisma.car.deleteMany();
    await prisma.driver.deleteMany();
  });

  test("Should be able to create a car", async () => {
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

  test("Should return an error if creating a car without token", async () => {
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
    const endpoint = endpointPrefix + driver.id + endpointSuffix;
    const randomToken =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";

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