import express from "express";
import "express-async-errors";
import { initRoutes } from "./routes";
import { handleError } from "./errors/handle.errors";

export const initApp = () => {
    const app = express();
    app.use(express.json());

    initRoutes(app);

    app.use(handleError)

};

export const app = initApp();