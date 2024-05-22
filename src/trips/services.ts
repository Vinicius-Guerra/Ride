import { prisma } from "../../prisma/database";
import { Trip, TripPayload } from "./interfaces";
import { tripSchema } from "./schemas";

export const createTripService = async (
  payload: TripPayload
): Promise<Trip> => {
  
  const newTrip = await prisma.trip.create({ data: payload });

  return tripSchema.parse(newTrip);
};
