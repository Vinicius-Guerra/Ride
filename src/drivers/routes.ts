import { Router } from "express";
import { handlePagination, isBodyValid } from "../@shared/middlewares";
import { carPayloadSchema } from "../cars/schemas";
import { createCarController } from "../cars/controllers";
import { createDriverController, listDriverController } from "./controllers";
import { driverPayloadSchema } from "./schemas";


import { ParamType } from "../@shared/interfaces";
import { isAuthenticated } from "../session/middleware";
import { driverExists, isAccountOwner } from "./middleware";

export const driverRouter = Router();

driverRouter.post("", isBodyValid(driverPayloadSchema), createDriverController);

driverRouter.get("", handlePagination, listDriverController);

driverRouter.post(
  "/:driverId/cars",
  isAuthenticated,
  driverExists(ParamType.URL_PARAM),
  isAccountOwner,
  isBodyValid(carPayloadSchema),
  createCarController
);