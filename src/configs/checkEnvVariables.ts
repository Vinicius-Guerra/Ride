import { z } from "zod";
import { logger } from "./winston.logger";

const envVariablesSchema = z.object({
  JWT_SECRET: z.string(),
  DATABASE_URL: z.string(),
  JWT_EXPIRES_IN: z.string(),
});

export const checkEnvVariables = () => {
  const result = envVariablesSchema.safeParse(process.env);

  if (!result.success) {
    result.error.issues.forEach(({ path }) => {
      logger.error(`Missing enviroment variable '${path}'`);
      // console.log(`Missing enviroment variable '${path}'`);
      // logger.warn(`Missing enviroment variable '${path}'`);
      // logger.info(`Missing enviroment variable '${path}'`);
      // logger.http(`Missing enviroment variable '${path}'`);
    });

    process.exit(1);
  }
};
