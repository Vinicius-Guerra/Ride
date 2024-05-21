import { Router } from "express";
import { createController } from "./controllers";
import { carPayloadSchema } from "./schemas";
import { isBodyValid } from "../middlewares";

export const carRouter = Router();

carRouter.post("/", isBodyValid(carPayloadSchema), createController);