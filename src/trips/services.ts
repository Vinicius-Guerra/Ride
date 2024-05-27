import { hash } from "bcryptjs";
import { prisma } from "../../prisma/database";
import { Trip, TripPayload } from "./interfaces";
import { tripSchema } from "./schemas";
import { createPaymentService } from "../payments/services";

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
