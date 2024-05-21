import { z } from "zod";
import {
  driverPayloadSchema,
  driverResponseSchema,
  driverSchema,
} from "./schemas";

export type Driver = z.infer<typeof driverSchema>;
export type DriverPayload = z.infer<typeof driverPayloadSchema>;
export type DriverResponse = z.infer<typeof driverResponseSchema>;