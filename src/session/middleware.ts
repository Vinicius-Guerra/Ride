import { NextFunction, Request, Response } from "express";
import { prisma } from "../../prisma/database";
import { ApiError } from "../@shared/errors/api.errors";
import { verify } from "jsonwebtoken";
import { parsedEnv } from "../@shared/configs";

export const isAuthenticated = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authorization = req.headers.authorization;

  if (!authorization) {
    throw new ApiError("Token is required.", 401);
  }

  const [bearer, token] = authorization.split(" ");

  if (bearer !== "Bearer" || !token) {
    throw new ApiError("Invalid token format.", 401);
  }

  const secret = parsedEnv.JWT_SECRET;

  try {
    const jwtPayload = verify(token, secret);
    res.locals = { ...res.locals, decoded: jwtPayload };
    return next();
  } catch (err) {
    throw new ApiError("Invalid or expired token.", 401);
  }
};

