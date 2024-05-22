import { Router } from "express";
import { isBodyValid } from "../@shared/middlewares";
import { createTripController } from "./controllers";
import { tripPayloadSchema } from "./schemas";
import { ParamType } from "../@shared/interfaces";
import { driverExists } from "../drivers/middleware";
import { customerExists } from "../customers/middleware";


export const tripRouter = Router();

tripRouter.post(
  "/",
  isBodyValid(tripPayloadSchema),
  driverExists(ParamType.BODY_PARAM),
  customerExists(ParamType.BODY_PARAM),
  createTripController
);
