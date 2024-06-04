import express from "express";
import "express-async-errors";
import { initSwagger } from "./@shared/configs/swagger";
import { initRoutes } from "./routes";
import { initLoggers } from "./@shared/loggers";
import { initErrorHandler } from "./@shared/errors";

export const initApp = () => {
  const app = express();
  app.use(express.json());

  initLoggers(app);
  initRoutes(app);
  initErrorHandler(app);
  initSwagger(app)

  return app;
};

export const app = initApp();