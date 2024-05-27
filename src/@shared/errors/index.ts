import { Express } from "express";
import { handleError } from "./handle.errors";

export const initErrorHandler = (app: Express) => {
  app.use(handleError);
};