import { z } from "zod";
import {
  customerPayloadSchema,
  customerResponseSchema,
  customerSchema,
} from "./schemas";

export type Customer = z.infer<typeof customerSchema>;
export type CustomerPayload = z.infer<typeof customerPayloadSchema>;
export type CustomerResponse = z.infer<typeof customerResponseSchema>;