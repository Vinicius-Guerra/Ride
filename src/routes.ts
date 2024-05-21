import { Express } from "express";
import { driverRouter } from "./drivers/routes";

export const initRoutes = (app: Express) => {
  //app.use("/api/cars", carRouter);
  app.use("/api/drivers", driverRouter);
};