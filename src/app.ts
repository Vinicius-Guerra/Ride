import express from "express";
import "express-async-errors";
import cors from "cors";
import { initSwagger } from "./@shared/configs/swagger";
import { initRoutes } from "./routes";
import { initLoggers } from "./@shared/loggers";
import { initErrorHandler } from "./@shared/errors";

export const initApp = () => {
  const app = express();
  app.use(express.json());
  app.use(cors());

  initLoggers(app);
  initRoutes(app);
  initErrorHandler(app);
  initSwagger(app)

  return app;
};

export const app = initApp();