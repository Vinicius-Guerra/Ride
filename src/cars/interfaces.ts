// import { Car } from "@prisma/client";
import { z } from "zod";
import { carSchema } from "./schemas";

export type Car = z.infer<typeof carSchema>;
export type CarPayload = Omit<Car, "id">;
