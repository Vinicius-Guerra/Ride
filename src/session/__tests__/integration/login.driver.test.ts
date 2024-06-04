import { prisma } from "../../../../prisma/database";
import supertest from "supertest";
import { app } from "../../../app";
import { Driver } from "@prisma/client";
import { DriverPayload } from "../../../drivers/interfaces";
import { hash } from "bcryptjs";
import { DriverFactory } from "../../../drivers/__tests__/factories";

describe("POST /login", () => {
  const request = supertest(app);
  const endpoint = "/api/login";
  let driverData: DriverPayload;
  const rawPassword = "1234";

  beforeAll(async () => {
    driverData = await DriverFactory.create({ password: await hash(rawPassword, 10) });
  });

  afterAll(async () => {
    await prisma.driver.deleteMany();
  });

  test("Should be able to login a Driver", async () => {
    const validPayload = {
      email: driverData.email,
      password: rawPassword,
    };

    const response = await request.post(endpoint).send(validPayload);

    const expectedResponseBody = {
      token: expect.any(String),
    };

    expect(response.body).toEqual(expectedResponseBody);
    expect(response.status).toBe(200);
  });

  test("Should not be able to login with incorrect email", async () => {
    const invalidEmailPayload = {
      email: "invalid.email.com.br",
      password: rawPassword,
    };

    const response = await request.post(endpoint).send(invalidEmailPayload);

    expect(response.body).toEqual({
      error: "Invalid credentials.",
    });

    expect(response.status).toBe(401);
  });

  test("Should not be able to login with incorrect password", async () => {
    const invalidPasswordPayload = {
      email: driverData.email,
      password: "invalidPassword",
    };

    const response = await request.post(endpoint).send(invalidPasswordPayload);

    expect(response.body).toEqual({
      error: "Invalid credentials.",
    });

    expect(response.status).toBe(401);
  });
});