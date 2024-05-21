import { prisma } from "../../../../prisma/database";
import supertest from "supertest";
import { app } from "../../../app";
import { Driver } from "@prisma/client";
import { DriverPayload } from "../../../drivers/interfaces";
import { hash } from "bcryptjs";

describe("POST /login", () => {
  const request = supertest(app);
  const endpoint = "/api/login";
  let driverData: DriverPayload;
  const rawPassword = "1234";

  beforeAll(async () => {
    driverData = {
      email: "driver1@mail.com",
      password: await hash(rawPassword, 10),
      firstName: "Chrystian",
      lastName: "Rodolfo",
    };
    await prisma.driver.create({ data: driverData });
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

 
});
