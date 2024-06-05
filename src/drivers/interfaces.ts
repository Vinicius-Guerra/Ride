import { z } from "zod";
import {
  driverPayloadSchema,
  driverResponseSchema,
  driverSchema,
  driverUpdatePayloadSchema,
} from "./schemas";

export type Driver = z.infer<typeof driverSchema>;
export type DriverPayload = z.infer<typeof driverPayloadSchema>;
export type DriverUpdatePayload = z.infer<typeof driverUpdatePayloadSchema>;
export type DriverResponse = z.infer<typeof driverResponseSchema>;