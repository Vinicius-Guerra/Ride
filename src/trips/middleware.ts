import { NextFunction, Request, Response } from "express";
import { ApiError } from "../errors/api.errors";

export const isTripDriver = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { sub } = res.locals.decoded;
    const { driverId } = req.body;

    if(Number(sub) !== driverId) {
        throw new ApiError("You dont have permission to perform this action.", 403);
    }

    return next();
}