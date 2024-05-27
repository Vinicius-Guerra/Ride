import winston from "winston";

const { combine, timestamp, colorize, printf, align } = winston.format;

const customLogLevels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

export const logLevelKeys = Object.keys(customLogLevels);

const logColors = {
  error: "red",
  warn: "yellow",
  info: "cyan",
  http: "magenta",
  debug: "white",
};

winston.addColors(logColors);

export const logger = winston.createLogger({
  levels: customLogLevels,
  level: "info",
  format: combine(
    colorize({ all: true }),
    timestamp(),
    align(),
    printf((info) => {
      return `[${info.timestamp}] ${info.level}: ${info.message.trim()}`;
    })
  ),
  transports: [new winston.transports.Console()],
});