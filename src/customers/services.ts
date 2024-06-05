import { hash } from "bcryptjs";
import { prisma } from "../prisma/database";
import { ApiError } from "../@shared/errors/api.errors";
import { Customer, CustomerPayload, CustomerResponse, CustomerUpdatePayload } from "./interfaces";
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

export const listCustomerService = async (): Promise<CustomerResponse[]> => {
  const customers = await prisma.customer.findMany();
  
  return customers;
};

export const listOneCustomerService = async (id: number): Promise<CustomerResponse> => {
  const customer = await prisma.customer.findFirst({ where: { id } });

  return customerResponseSchema.parse(customer);
};

export const updateCustomerService = async (id: number, payload: CustomerUpdatePayload): Promise<CustomerResponse> => {
  const customerUpdated = await prisma.customer.update({ where: { id }, data: payload });

  return customerResponseSchema.parse(customerUpdated);
};

export const deleteCustomerService = async (id: number): Promise<void> => {
  await prisma.customer.delete({ where: { id } });
};