import { Router } from "express";
import { isBodyValid } from "../@shared/middlewares";
import { carPayloadSchema } from "../cars/schemas";
import { createCarController } from "../cars/controllers";
import { createDriverController } from "./controllers";
import { driverPayloadSchema } from "./schemas";
import { driverExists, isAccountOwner } from "./middleware";
import { isAuthenticated } from "../session/middleware";


export const driverRouter = Router();

driverRouter.post(
  "/",
  isBodyValid(driverPayloadSchema),
  createDriverController
);

/*
  Esteira de validações:
  1. Está autenticado? (isAuthenticaded)
  2. driverId existe? (driverExists)
  3. Dono do token é o dono do recurso (driverId)? (isAccountOwner)
  4. Corpo da req é valido? (isBodyValid)
*/

// DESAFIO -> CRIAR TESTES PARA A ROTA ABAIXO
driverRouter.post(
  "/:driverId/cars",
  isAuthenticated,
  driverExists,
  isAccountOwner,
  isBodyValid(carPayloadSchema),
  createCarController
);
