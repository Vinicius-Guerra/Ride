import { fakerPT_BR as faker } from "@faker-js/faker";
import { PaymentMethod } from "@prisma/client";
import { prisma } from "../../@shared/database/database";
import { Payment, PaymentPayload } from "../interfaces";

const getRandomValueFromEnum = (givenEnum: object) => {
  const enumValues = Object.values(givenEnum);
  // console.log(enumValues);
  // gerar numero inteiro aleatorio entre 0 e 2
  const randomIndex = Math.floor(Math.random() * enumValues.length);
  // console.log(enumValues[randomIndex]);

  return enumValues[randomIndex];
};

export class PaymentFactory {
  static build = (data: Partial<Payment> = {}) => {
    return {
      method: getRandomValueFromEnum(PaymentMethod),
      amount: faker.number.int({ min: 100, max: 1000000 }),
      ...data,
    };
  };

  static create = async (data: Partial<PaymentPayload> = {}) => {
    const paymentData = PaymentFactory.build(data);

    return await prisma.payment.create({ data: paymentData });
  };
}