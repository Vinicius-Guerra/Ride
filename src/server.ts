import { parsedEnv } from "./@shared/configs";
import { app } from "./app";
import { logger } from "./configs/winston.logger";

const PORT = parsedEnv.PORT || 3000;

app.listen(PORT, () => {
  logger.info(`Application is running on port: ${PORT}`);
});