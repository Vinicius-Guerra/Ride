import { z } from "zod";
import { logger } from "../loggers/winston.logger";
import { logLevelKeys } from "../loggers/winston.logger";

enum AppEnv {
  developmnet = "DEV",
  production = "PROD",
  testing = "TEST",
}

const envVariablesSchema = z.object({
  JWT_SECRET: z.string(),
  DATABASE_URL: z.string(),
  JWT_EXPIRES_IN: z.string().default("1h"),
  APP_ENV: z.nativeEnum(AppEnv),
  LOG_LEVEL: z.enum([logLevelKeys[0], ...logLevelKeys.slice(1)]),
  PORT: z.string().default("3000"),
});

const checkEnvVariables = () => {
  const result = envVariablesSchema.safeParse(process.env);

  if (!result.success) {
    result.error.issues.forEach(({ path, message }) => {
      logger.error(`Enviroment variable '${path}': ${message}`);
    });

    process.exit(1);
  }

  return result.data;
};

export const parsedEnv = checkEnvVariables();