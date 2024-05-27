import { fakerPT_BR as faker } from "@faker-js/faker";
import { prisma } from "../../../prisma/database";
import { Trip, TripPayload } from "../interfaces";
import { TripStatus } from "@prisma/client";

type TripFactoryCreatePayload = Partial<
  Omit<TripPayload, "payment" | "customerId" | "driverId" | "paymentId"> & {
    status: TripStatus;
    updatedAt: Date;
  }
>;

type TripFactoryBuildPayload = Partial<
  Omit<TripPayload, "payment" | "customerId" | "driverId" | "paymentId">
>;

const generateBrazilianAddress = () => {
  return (
    faker.location.street().split(" ").reverse().join(" ") +
    ", " +
    faker.string.numeric({ length: { min: 1, max: 5 } })
  );
};

export class TripFactory {
  static build = (data: TripFactoryBuildPayload = {}) => {
    return {
      source: generateBrazilianAddress(),
      destination: generateBrazilianAddress(),
      ...data,
    };
  };

  static create = async (
    relations: {
      customerId: number;
      driverId: number;
      paymentId: number;
    },
    data: TripFactoryCreatePayload = {}
  ) => {
    const tripData = TripFactory.build(data);

    return await prisma.trip.create({
      data: {
        ...tripData,
        paymentId: relations.paymentId,
        customerId: relations.customerId,
        driverId: relations.driverId,
      },
    });
  };
}