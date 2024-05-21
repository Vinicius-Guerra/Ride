import { compare } from "bcryptjs";
import { prisma } from "../../prisma/database";
import { ApiError } from "../errors/api.errors";
import { SessionPayload } from "./interfaces";
import { sessionResponseSchema } from "./schemas";
import { sign } from "jsonwebtoken";

export const login = async ({ email, password }: SessionPayload) => {
  const foundDriver = await prisma.driver.findUnique({ where: { email } });

  if (!foundDriver) {
    throw new ApiError("Invalid credentials.", 401);
  }

  const passwordMatch = await compare(password, foundDriver.password);

  if (!passwordMatch) {
    throw new ApiError("Invalid credentials.", 401);
  }

  const secret = process.env.JWT_SECRET as string;
  const expiresIn = process.env.JWT_EXPIRES_IN as string;

  const token = sign({ firstName: foundDriver.firstName }, secret, {
    subject: foundDriver.id.toString(),
    expiresIn: expiresIn,
  });

  return sessionResponseSchema.parse({ token });
};
