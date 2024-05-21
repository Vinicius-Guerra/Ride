import { Express } from "express";
import { driverRouter } from "./drivers/routes";
import { sessionRouter } from "./session/routes";

export const initRoutes = (app: Express) => {
  app.use("/api/drivers", driverRouter);
  app.use("/api/login", sessionRouter);
};
