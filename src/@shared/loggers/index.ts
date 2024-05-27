import { Express } from "express";
import { customMorganLogger } from "./morgan.logger";
import { parsedEnv } from "../configs";
import { logger } from "./winston.logger";

export const initLoggers = (app: Express) => {
  // Não mostra logs de http nos testes
  if (parsedEnv.APP_ENV !== "TEST") {
    app.use(customMorganLogger);
  }

  logger.level = parsedEnv.APP_ENV === "PROD" ? "info" : parsedEnv.LOG_LEVEL;
};