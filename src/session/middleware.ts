import { NextFunction, Request, Response } from "express";
import { prisma } from "../../prisma/database";
import { ApiError } from "../errors/api.errors";
import { verify } from "jsonwebtoken";

export const isAuthenticated = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { authorization } = req.headers;

  if (!authorization) {
    throw new ApiError("Token is required.", 401);
  }

  // Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmaXJzdE5hbWUiOiJDaHJ5c3RpYW4iLCJpYXQiOjE3MTUwODczNzcsImV4cCI6MTcxNTA5MDk3Nywic3ViIjoiMiJ9.Zq0qHunKj507n9grOFb14Cf-5QU-sVumimtb1_kGazs
  const [_, token] = authorization.split(" ");

  const secret = process.env.JWT_SECRET as string;

  const jwtPayload = verify(token, secret);

  res.locals = { ...res.locals, decoded: jwtPayload };

  return next();
};
