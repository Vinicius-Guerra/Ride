import { Router } from "express";
import { isBodyValid } from "../@shared/middlewares";
import { createCustomerController } from "./controllers";
import { customerPayloadSchema } from "./schemas";

export const customerRouter = Router();

customerRouter.post(
  "/",
  isBodyValid(customerPayloadSchema),
  createCustomerController
);
