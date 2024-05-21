import { Router } from "express";
import { sessionController } from "./controllers";

export const sessionRouter = Router();

sessionRouter.post("/", sessionController);
