import { Router } from "express";
import { isBodyValid } from "../@shared/middlewares";
import { createTripController } from "./controllers";
import { tripPayloadSchema } from "./schemas";
import { ParamType } from "../@shared/interfaces/enum.interfaces";
import { driverExists } from "../drivers/middleware";
import { customerExists } from "../customers/middleware";
import { isAuthenticated } from "../session/middleware";
import { isTripDriver } from "./middleware";


export const tripRouter = Router();

tripRouter.post(
  "/",
  isAuthenticated,
  isBodyValid(tripPayloadSchema),
  driverExists(ParamType.BODY_PARAM),
  isTripDriver,
  customerExists(ParamType.BODY_PARAM),
  createTripController
);
