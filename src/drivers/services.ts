import { hash } from "bcryptjs";
import { prisma } from "../../prisma/database";
import { ApiError } from "../@shared/errors/api.errors";
import { Driver, DriverPayload, DriverResponse } from "./interfaces";
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