import express from "express";
import "express-async-errors";


const app = express();

export const initApp = () => {
    app.use(express.json());

};

export default app;