import { Router } from "express";
import { handlePagination, isBodyValid } from "../@shared/middlewares";
import { carPayloadSchema } from "../cars/schemas";
import { createCarController, deleteCarController, listCarController, partialUpdateCarController, retrieveCarController } from "../cars/controllers";
import { createDriverController, deleteDriverController, listDriverController, listOneDriverController, updateDriverController } from "./controllers";
import { driverPayloadSchema, driverUpdatePayloadSchema } from "./schemas";


import { ParamType } from "../@shared/interfaces";
import { isAuthenticated } from "../session/middleware";
import { driverExists, isAccountDriverOwner, isAccountOwner } from "./middleware";

export const driverRouter = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     DriverPayload:
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
 *           description: The driver's email
 *         password:
 *           type: string
 *           description: The driver's password
 *         firstName:
 *           type: string
 *           description: The driver's first name
 *         lastName:
 *           type: string
 *           description: The driver's last name
 *         dateOfBirth:
 *           type: string
 *           format: date
 *           nullable: true
 *           description: The driver's date of birth
 *     DriverResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated id of the driver
 *         email:
 *           type: string
 *           format: email
 *           description: The driver's email
 *         firstName:
 *           type: string
 *           description: The driver's first name
 *         lastName:
 *           type: string
 *           description: The driver's last name
 *         dateOfBirth:
 *           type: string
 *           format: date
 *           nullable: true
 *           description: The driver's date of birth
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date and time when the driver was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The date and time when the driver was last updated
 */

/**
 * @swagger
 * api/drivers:
 *   post:
 *     summary: Create a new driver
 *     tags: [Drivers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DriverPayload'
 *     responses:
 *       201:
 *         description: Driver created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DriverResponse'
 *       400:
 *         description: Bad Request
 */
driverRouter.post("", isBodyValid(driverPayloadSchema), createDriverController);


/**
 * @swagger
 * api/drivers:
 *   get:
 *     summary: Get a list of drivers
 *     tags: [Drivers]
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
 *         description: A list of drivers
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/DriverResponse'
 */
driverRouter.get("", handlePagination, listDriverController);

/**
 * @swagger
 * api/drivers/:id:
 *   get:
 *     summary: Get a one Driver
 *     tags: [Drivers]
 *     parameters:
 *     responses:
 *       200:
 *         description: A list one driver
 *         content:
 *           application/json:
 *             schema:
 *               items:
 *                 $ref: '#/components/schemas/DriverResponse'
 *       400:
 *         description: Bad Request 
 *       401:
 *         description: Token is required.
 */
driverRouter.get("/:id", isAuthenticated, listOneDriverController);

/**
 * @swagger
 * api/drivers/:id:
 *   patch:
 *     summary: Update a driver
 *     tags: [Drivers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DriverUpdatePayload'
 *     responses:
 *       201:
 *         description: Driver update successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DriverResponse'
 *       400:
 *         description: Invalid Driver Id
 *       401:
 *         description: Token is required.
 *       403:
 *         description: User is not the owner of this driver
 *       404:
 *         description: Driver not found
 */
driverRouter.patch("/:id", isAuthenticated, isAccountDriverOwner, isBodyValid(driverUpdatePayloadSchema), updateDriverController);


/**
 * @swagger
 * api/drtivers/:id:
 *   delete:
 *     summary: Delete a driver
 *     tags: [Drivers]
 *     responses:
 *       204:
 *         description: Driver delete successfully
 *         content:
 *           application/json:
 *             type: object
 *       400:
 *         description: Bad Request
 *       401:
 *         description: Token is required.
 *       403:
 *         description: User is not the owner of this Driver
 */
driverRouter.delete("/:id", isAuthenticated, isAccountDriverOwner, deleteDriverController);

/**
 * @swagger
 * components:
 *   schemas:
 *     CarPayload:
 *       type: object
 *       required:
 *         - model
 *         - licensePlate
 *       properties:
 *         model:
 *           type: string
 *           description: The model of the car
 *         licensePlate:
 *           type: string
 *           description: The car's license plate
 *     CarResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated id of the car
 *         model:
 *           type: string
 *           description: The model of the car
 *         licensePlate:
 *           type: string
 *           description: The car's license plate
 *         driverId:
 *           type: integer
 *           description: The id of the driver to whom the car belongs
 */

/**
 * @swagger
 * api/drivers/{driverId}/cars:
 *   post:
 *     summary: Add a new car to a driver
 *     tags: [Drivers, Cars]
 *     parameters:
 *       - in: path
 *         name: driverId
 *         schema:
 *           type: integer
 *         required: true
 *         description: The id of the driver
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CarPayload'
 *     responses:
 *       201:
 *         description: Car added successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CarResponse'
 *       400:
 *         description: Bad Request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Driver not found
 */
driverRouter.post(
  "/:driverId/cars",
  isAuthenticated,
  driverExists(ParamType.URL_PARAM),
  isAccountOwner,
  isBodyValid(carPayloadSchema),
  createCarController
);

/**
 * @swagger
 * api/drivers/{driverId}/cars:
 *   get:
 *     summary: Get a list of cars
 *     tags: [Cars]
 *     parameters:
 *     responses:
 *       200:
 *         description: A list of cars for drivers
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/CarResponse'
 *       400:
 *         description: Bad Request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Driver not found 
 */
driverRouter.get(
  "/:driverId/cars",
  isAuthenticated,
  driverExists(ParamType.URL_PARAM),
  isAccountOwner,
  listCarController
)

/**
 * @swagger
 * api/drivers/{driverId}/cars/:id:
 *   get:
 *     summary: Get a car
 *     tags: [Cars]
 *     parameters:
 *     responses:
 *       200:
 *         description: A car for driver
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               items:
 *                 $ref: '#/components/schemas/CarResponse'
 *       400:
 *         description: Bad Request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Driver not found 
 */
driverRouter.get(
  "/:driverId/cars/:id",
  isAuthenticated,
  driverExists(ParamType.URL_PARAM),
  isAccountOwner,
  retrieveCarController
)

/**
 * @swagger
 * api/drivers/{driverId}/cars/:id:
 *   delete:
 *     summary: Delete a car
 *     tags: [Cars]
 *     parameters:
 *     responses:
 *       200:
 *         description: Delete a car for driver
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       400:
 *         description: Bad Request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Driver not found 
 */
driverRouter.delete(
  "/:driverId/cars/:id",
  isAuthenticated,
  isAccountOwner,
  deleteCarController
)

