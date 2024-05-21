import { z } from "zod";
import {
  paymentPayloadSchema,
  paymentSchema,
} from "./schemas";

export type Payment = z.infer<typeof paymentSchema>;
export type PaymentPayload = z.infer<typeof paymentPayloadSchema>;
