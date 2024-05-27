import { NextFunction, Request, Response } from "express";
import { ZodSchema } from "zod";

export const isBodyValid =
  (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json(result.error.flatten().fieldErrors);
    }

    req.body = result.data;

    return next();
  };