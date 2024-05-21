import { Router } from "express";
import { isBodyValid } from "../middlewares";
import { carPayloadSchema } from "../cars/schemas";
import { createCarController } from "../cars/controllers";
import { createDriverController } from "./controllers";
import { driverPayloadSchema } from "./schemas";

export const driverRouter = Router();

driverRouter.post(
  "/",
  isBodyValid(driverPayloadSchema),
  createDriverController
);

driverRouter.post(
  "/:driverId/cars",
  isBodyValid(carPayloadSchema),
  createCarController
);