import express from "express";
import "express-async-errors";
import { initRoutes } from "./routes";
import { handleError } from "./@shared/errors/handle.errors";
// import logger from "morgan";
import { checkEnvVariables } from "./configs/checkEnvVariables";
import { customMorganLogger } from "./configs/morgan.logger";

export const initApp = () => {
  const app = express();
  // app.use(logger("dev"));
  // app.use(logger("combined"));
  app.use(customMorganLogger);
  app.use(express.json());

  checkEnvVariables();

  initRoutes(app);

  app.use(handleError);

  return app;
};

// export default app;
export const app = initApp();