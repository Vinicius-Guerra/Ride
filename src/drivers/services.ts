import { hash } from "bcryptjs";
import { prisma } from "../../prisma/database";
import { ApiError } from "../errors/api.errors";
import { Driver, DriverPayload, DriverResponse } from "./interfaces";
import { driverResponseSchema } from "./schemas";

export const createDriverService = async (payload: DriverPayload): Promise<DriverResponse> => {
  const driverWithDuplicatedEmail = await prisma.driver.findUnique({
    where: { email: payload.email },
  });

  if (driverWithDuplicatedEmail) {
    throw new ApiError("Email already used.", 409);
  }

  payload.password = await hash(payload.password, 10);
  const newDriver = await prisma.driver.create({ data: payload });

  return driverResponseSchema.parse(newDriver);
};