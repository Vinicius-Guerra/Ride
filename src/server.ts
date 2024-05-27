import { parsedEnv } from "./@shared/configs";
import { logger } from "./@shared/loggers/winston.logger";
import { app } from "./app";


const PORT = parsedEnv.PORT || 3000;

app.listen(PORT, () => {
  logger.info(`Application is running on port: ${PORT}`);
});