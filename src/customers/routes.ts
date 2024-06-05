import { Router } from "express";
import { isBodyValid } from "../@shared/middlewares";
import {
  createCustomerController,
  deleteCustomerController,
  listCustomerController,
  listOneCustomerController,
  updateCustomerController,
} from "./controllers";
import { customerPayloadSchema, customerUpdatePayloadSchema } from "./schemas";
import { customerExists, isCostumerOwner } from "./middleware";
import { ParamType } from "../@shared/interfaces";
import { isAuthenticated } from "../session/middleware";

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


/**
 * @swagger
 * api/customers/:id:
 *   get:
 *     summary: Get a one Customer
 *     tags: [Customers]
 *     parameters:
 *     responses:
 *       200:
 *         description: A list one customers
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               items:
 *                 $ref: '#/components/schemas/CustomerResponse'
 *       400:
 *         description: Bad Request 
 */
customerRouter.get("/:id", isAuthenticated, isCostumerOwner.execute, listOneCustomerController);


/**
 * @swagger
 * api/customers/:id:
 *   patch:
 *     summary: Update a customer
 *     tags: [Customers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CustomerUpdatePayload'
 *     responses:
 *       201:
 *         description: Customer update successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CustomerResponse'
 *       400:
 *         description: Bad Request
 */
customerRouter.patch("/:id", isAuthenticated, isCostumerOwner.execute,isBodyValid(customerUpdatePayloadSchema), customerExists(ParamType.BODY_PARAM), updateCustomerController);


/**
 * @swagger
 * api/customers/:id:
 *   delete:
 *     summary: Delete a customer
 *     tags: [Customers]
 *     responses:
 *       204:
 *         description: Customer delete successfully
 *         content:
 *           application/json:
 *             type: object
 *       400:
 *         description: Bad Request
 */
customerRouter.delete("/:id", isAuthenticated, isCostumerOwner.execute, deleteCustomerController);
