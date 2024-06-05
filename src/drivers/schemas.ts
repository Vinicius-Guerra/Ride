import { z } from "zod";

export const driverSchema = z.object({
  id: z.number().positive(),
  email: z.string().email().max(255),
  password: z.string().max(255),
  firstName: z.string().max(50),
  lastName: z.string().max(50),
  dateOfBirth: z.date().nullish(),
  createdAt: z.date(),
  updatedAt: z.date(),
});


export const driverPayloadSchema = driverSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const driverUpdatePayloadSchema = driverPayloadSchema.partial();

export const driverResponseSchema = driverSchema.omit({ password: true });
