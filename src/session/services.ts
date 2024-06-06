import { compare } from "bcryptjs";
import { prisma } from "../../prisma/database";
import { ApiError } from "../@shared/errors/api.errors";
import { SessionPayload } from "./interfaces";
import { sessionResponseSchema } from "./schemas";
import { sign } from "jsonwebtoken";
import { parsedEnv } from "../@shared/configs";

export const login = async ({ email, password }: SessionPayload) => {
  const foundDriver = await prisma.driver.findUnique({ where: { email } });

  if (!foundDriver) {
    throw new ApiError("Invalid credentials.", 401);
  }

  const passwordMatch = await compare(password, foundDriver.password);

  if (!passwordMatch) {
    throw new ApiError("Invalid credentials.", 401);
  }

  const secret = parsedEnv.JWT_SECRET;
  const expiresIn = parsedEnv.JWT_EXPIRES_IN;

  const token = sign({ firstName: foundDriver.firstName }, secret, {
    subject: foundDriver.id.toString(),
    expiresIn: expiresIn,
  });

  return sessionResponseSchema.parse({ token });
};

export const loginCustomer = async ({ email, password }: SessionPayload) => {
  const foundCustomer = await prisma.customer.findUnique({ where: { email } });

  if (!foundCustomer) {
    throw new ApiError("Invalid credentials.", 401);
  }

  const passwordMatch = await compare(password, foundCustomer.password);

  if (!passwordMatch) {
    throw new ApiError("Invalid credentials.", 401);
  }

  const secret = parsedEnv.JWT_SECRET;
  const expiresIn = parsedEnv.JWT_EXPIRES_IN;

  const token = sign({ firstName: foundCustomer.firstName }, secret, {
    subject: foundCustomer.id.toString(),
    expiresIn: expiresIn,
  });

  return sessionResponseSchema.parse({ token });
};