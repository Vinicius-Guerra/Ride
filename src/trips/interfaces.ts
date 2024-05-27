import { z } from "zod";
import { tripPayloadSchema, tripSchema } from "./schemas";

export type Trip = z.infer<typeof tripSchema>;
export type TripPayload = z.infer<typeof tripPayloadSchema>;
