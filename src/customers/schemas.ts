import { z } from "zod";

export const customerSchema = z.object({
  id: z.number().positive(),
  email: z.string().email().max(255),
  password: z.string().max(255),
  firstName: z.string().max(50),
  lastName: z.string().max(50),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const customerPayloadSchema = customerSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const customerResponseSchema = customerSchema.omit({ password: true });
