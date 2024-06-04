import { Router } from "express";
import { isBodyValid } from "../@shared/middlewares";
import {
  createCustomerController,
  listCustomerController,
} from "./controllers";
import { customerPayloadSchema } from "./schemas";

export const customerRouter = Router();


/**
 * @swagger
 * components:
 *   schemas:
 *     CustomerPayload:
 *       type: object
 *       required:
 *         - email
 *         - password
 *         - firstName
 *         - lastName
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: The customer email
 *         password:
 *           type: string
 *           description: The customer password
 *         firstName:
 *           type: string
 *           description: The customer first name
 *         lastName:
 *           type: string
 *           description: The customer last name
 *     CustomerrResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated id of the customer
 *         email:
 *           type: string
 *           format: email
 *           description: The customer email
 *         firstName:
 *           type: string
 *           description: The customer first name
 *         lastName:
 *           type: string
 *           description: The customer last name
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date and time when the customer was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The date and time when the customer was last updated
 */

/**
 * @swagger
 * api/customers:
 *   post:
 *     summary: Create a new customer
 *     tags: [Customers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CustomerPayload'
 *     responses:
 *       201:
 *         description: Customer created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CustomerResponse'
 *       400:
 *         description: Bad Request
 */
customerRouter.post(
  "",
  isBodyValid(customerPayloadSchema),
  createCustomerController
);

/**
 * @swagger
 * api/customers:
 *   get:
 *     summary: Get a list of Customer
 *     tags: [Customers]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: A list of customers
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/CustomerResponse'
 */
customerRouter.get("", listCustomerController);