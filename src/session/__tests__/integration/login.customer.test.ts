import { prisma } from "../../../../prisma/database";
import supertest from "supertest";
import { app } from "../../../app";
import { hash } from "bcryptjs";
import { CustomerPayload } from "../../../customers/interfaces";
import { CustomerFactory } from "../../../customers/__tests__/factories";

describe("POST /login/customer", () => {
  const request = supertest(app);
  const endpoint = "/api/login/customer";
  let customerData: CustomerPayload;
  const rawPassword = "1234";

  beforeAll(async () => {
    customerData = await CustomerFactory.create({ password: await hash(rawPassword, 10) });
  });

  afterAll(async () => {
    await prisma.customer.deleteMany();
  });

  test("Should be able to login a Customer", async () => {
    const validPayload = {
      email: customerData.email,
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
      email: customerData.email,
      password: "invalidPassword",
    };

    const response = await request.post(endpoint).send(invalidPasswordPayload);

    expect(response.body).toEqual({
      error: "Invalid credentials.",
    });

    expect(response.status).toBe(401);
  });
});