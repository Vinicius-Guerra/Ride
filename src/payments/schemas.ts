import { z } from "zod";
import { PaymentMethod } from "@prisma/client";

export const paymentSchema = z.object({
  id: z.number().positive(),
  method: z.nativeEnum(PaymentMethod),
  amount: z.number().positive(),
  createdAt: z.date(),
});

export const paymentPayloadSchema = paymentSchema.omit({
  id: true,
  createdAt: true,
});

