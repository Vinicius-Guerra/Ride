import { prisma } from "../../prisma/database";
import { ApiError } from "../errors/api.errors";
import { Payment, PaymentPayload } from "./interfaces";
import { paymentPayloadSchema, paymentSchema } from "./schemas";


export const createPaymentService = async (
  payload: PaymentPayload
): Promise<Payment> => {
  const newPayment = await prisma.payment.create({ data: payload })

  return paymentSchema.parse(newPayment);
};
