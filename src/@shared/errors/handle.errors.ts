import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { ApiError } from "./api.errors";
import { logger } from "../loggers/winston.logger";
import { JsonWebTokenError } from "jsonwebtoken";

export const handleError = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): Response => {
  if (error instanceof JsonWebTokenError) {
    return res.status(401).json({ error: error.message });
  }

  if (error instanceof ApiError) {
    return res.status(error.statusCode).json({ error: error.message });
  }

  logger.debug(error.message);
  return res.status(500).json({ message: "Internal server error." });
};