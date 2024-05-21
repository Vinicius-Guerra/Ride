import { prisma } from "../../../../prisma/database";
import supertest from "supertest";
import { initApp } from "../../../app";


describe("Car create integration tests", () => {
  const request = supertest(initApp);
  const endpoint = "/api/cars";

  beforeEach(async () => {
    await prisma.car.deleteMany();
  });

  test("Should be able to create a car", async () => {
    const validPayload = {
      model: "Corsa Sedan",
      licensePlate: "AAA-1234",
    };

    const response = await request.post(endpoint).send(validPayload);

    const expectedResponseBody = {
      id: expect.any(Number),
      model: validPayload.model,
      licensePlate: validPayload.licensePlate,
    };

    expect(response.status).toBe(201);
    expect(response.body).toEqual(expectedResponseBody);
  });

  test("Should return an error if creating a car without required keys", async () => {
    const invalidPayload = {};
    const response = await request.post(endpoint).send(invalidPayload);

    expect(response.body.errors).toBeDefined();

    const requiredKeys = ["model", "licensePlate"];
    const receivedKeys = Object.keys(response.body.errors);
    expect(receivedKeys).toEqual(requiredKeys);

    requiredKeys.forEach((requiredKey) => {
      expect(response.body.errors[requiredKey]).toContain("Required");
    });
  });

  test("Should return an error if creating a car with duplicated license plate", async () => {
    const car1 = {
      model: "Corsa Sedan",
      licensePlate: "AAA-1234",
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
});