import { z } from "zod";
import { TripStatus } from "@prisma/client";
import { paymentPayloadSchema } from "../payments/schemas";

export const tripSchema = z.object({
  id: z.number().positive(),
  status: z.nativeEnum(TripStatus).nullish(),
  source: z.string(),
  destination: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  payment: paymentPayloadSchema,
  customerId: z.number().positive(),
  driverId: z.number().positive(),
});

export const tripPayloadSchema = tripSchema.omit({
  id: true,
  status: true,
  createdAt: true,
  updatedAt: true,
});