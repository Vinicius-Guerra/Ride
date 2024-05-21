import { Express } from "express";
import { driverRouter } from "./drivers/routes";
import { sessionRouter } from "./session/routes";
import { customerRouter } from "./customers/routes";

export const initRoutes = (app: Express) => {
  app.use("/api/drivers", driverRouter);
  app.use("/api/customers", customerRouter);
  app.use("/api/login", sessionRouter);
};
