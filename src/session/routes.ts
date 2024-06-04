import { Router } from "express";
import { sessionController, sessionCustomerController } from "./controllers";

export const sessionRouter = Router();

sessionRouter.post("/", sessionController);
sessionRouter.post("/customer", sessionCustomerController);
