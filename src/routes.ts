import { Express } from "express";
import { carRouter } from "./cars/routes";

export const initRoutes = (app: Express) => {
  app.use("/api/cars", carRouter);
};