import { Car } from "@prisma/client";

type CarPayload = Omit<Car, "id">;

export {Car, CarPayload};