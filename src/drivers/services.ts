import { hash } from "bcryptjs";
import { prisma } from "../../prisma/database";
import { ApiError } from "../@shared/errors/api.errors";
import { Driver, DriverPayload, DriverResponse, DriverUpdatePayload } from "./interfaces";
import { driverResponseSchema } from "./schemas";
import {
  PaginationData,
  PaginationResponse,
} from "../@shared/interfaces/pagination.interfaces";

export const createDriverService = async (
  payload: DriverPayload
): Promise<DriverResponse> => {
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

export const listDriverService = async ({
  page,
  perPage,
  nextPage,
  previousPage,
}: PaginationData): Promise<PaginationResponse<DriverResponse>> => {
  const drivers = await prisma.driver.findMany({
    skip: perPage * (page - 1),
    take: perPage,
  });

  const count = await prisma.driver.count();

  const paginatedResponse = {
    count,
    nextPage: page * perPage < count ? nextPage : null,
    previousPage,
    data: driverResponseSchema.array().parse(drivers),
  };

  return paginatedResponse;
};

export const listOneDriverService = async (id: number): Promise<DriverResponse> => {
  const driver = await prisma.driver.findFirst({ where: { id } });

  return driverResponseSchema.parse(driver);
};

export const updateDriverService = async (id: number, payload: DriverUpdatePayload): Promise<DriverResponse> => {
  const driverUpdated = await prisma.driver.update({ where: { id }, data: payload });

  return driverResponseSchema.parse(driverUpdated);
};

export const deleteDriverService = async (id: number): Promise<void> => {
  await prisma.driver.delete({ where: { id } });
};