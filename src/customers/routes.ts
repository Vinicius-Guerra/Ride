import { Router } from "express";
import { isBodyValid } from "../@shared/middlewares";
import {
  createCustomerController,
  listCustomerController,
} from "./controllers";
import { customerPayloadSchema } from "./schemas";

export const customerRouter = Router();

/*
  - Rota para login de customer
  - Atualização de customer
*/

customerRouter.get("", listCustomerController);

customerRouter.post(
  "",
  isBodyValid(customerPayloadSchema),
  createCustomerController
);