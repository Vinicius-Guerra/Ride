import { Router } from "express";
import { sessionController, sessionCustomerController } from "./controllers";

export const sessionRouter = Router();

/**
 * @swagger
 * api/session:
 *   post:
 *     summary: Create a new session (login) for drivers
 *     tags: [Session Login]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SessionPayload'
 *     responses:
 *       200:
 *         description: Sucessfully login
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SessionResponse'
 */
sessionRouter.post("/", sessionController);

/**
 * @swagger
 * api/session/customer:
 *   post:
 *     summary: Create a new session (login) for customers
 *     tags: [Session Login]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SessionPayload'
 *     responses:
 *       200:
 *         description: Sucessfully login
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SessionResponse'
 */
sessionRouter.post("/customer", sessionCustomerController);

