import { z } from "zod";

export const carSchema = z.object({
  id: z.number().positive(),
  model: z.string().max(100),
  licensePlate: z.string().regex(/^[A-Za-z]{3}-\d{4}$/, {
    message:
      "License plate has an invalid format. It must be in `AAA-1111` format.",
  }),
  driverId: z.number().positive(),
});

export const carPayloadSchema = carSchema.omit({ id: true, driverId: true });