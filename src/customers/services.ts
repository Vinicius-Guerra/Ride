import { hash } from "bcryptjs";
import { prisma } from "../../prisma/database";
import { ApiError } from "../@shared/errors/api.errors";
import { Customer, CustomerPayload, CustomerResponse } from "./interfaces";
import { customerResponseSchema } from "./schemas";

export const createCustomerService = async (
  payload: CustomerPayload
): Promise<CustomerResponse> => {
  const customerWithDuplicatedEmail = await prisma.customer.findUnique({
    where: { email: payload.email },
  });

  if (customerWithDuplicatedEmail) {
    throw new ApiError("Email already used.", 409);
  }

  payload.password = await hash(payload.password, 10);
  const newCustomer = await prisma.customer.create({ data: payload });

  return customerResponseSchema.parse(newCustomer);
};
