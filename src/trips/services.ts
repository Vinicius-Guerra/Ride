import { prisma } from "../../prisma/database";
import { Trip, TripPayload } from "./interfaces";
import { tripSchema } from "./schemas";
import { createPaymentService } from "../payments/services";
import {
  PaginationData,
  PaginationResponse,
} from "../@shared/interfaces/pagination.interfaces";

export const createTripService = async (
  payload: TripPayload
): Promise<Trip> => {
  const newPayment = await createPaymentService(payload.payment);

  const newTrip = await prisma.trip.create({
    data: {
      customerId: payload.customerId,
      driverId: payload.driverId,
      source: payload.source,
      destination: payload.destination,
      paymentId: newPayment.id,
    },
    include: { payment: true },
  });

  return tripSchema.parse(newTrip);
};

export const listTripService = async ({
  page,
  perPage,
  nextPage,
  previousPage,
}: PaginationData): Promise<PaginationResponse<Trip>> => {
  const trips = await prisma.trip.findMany({
    skip: perPage * (page - 1),
    take: perPage,
  });

  const count = await prisma.trip.count();

  const paginatedResponse = {
    count,
    nextPage: page * perPage < count ? nextPage : null,
    previousPage,
    data: tripSchema.array().parse(trips),
  };

  return paginatedResponse;
};