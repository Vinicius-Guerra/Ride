import { Router } from "express";
import { isBodyValid } from "../@shared/middlewares";
import { createTripController } from "./controllers";
import { tripPayloadSchema } from "./schemas";
import { ParamType } from "../@shared/interfaces/enum.interfaces";
import { driverExists } from "../drivers/middleware";
import { customerExists } from "../customers/middleware";
import { isAuthenticated } from "../session/middleware";
import { isTripDriver } from "./middleware";


export const tripRouter = Router();
/**
 * @swagger
 * components:
 *   schemas:
 *     TripPayload:
 *       type: object
 *       required:
 *         - source
 *         - destination
 *         - payment
 *         - driverId
 *         - costumerId
 *       properties:
 *         source:
 *           type: string
 *           description: The source init route.
 *         destination:
 *           type: string
 *           description: The destination finish route.
 *         payment:
 *           type: string
 *           description: The type payment. 
 *         driverId:
 *           type: integer
 *           description: The id driver.
 *         customerId:
 *           type: integer
 *           description: The id customer.
 *     Trip:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated id of the trip
 *         source:
 *           type: string
 *           description: The source init route.
 *         destination:
 *           type: string
 *           description: The destination finish route.
 *         createdAt:
 *           type: date
 *           description: Date actually.
 *         updatedAt:
 *           type: date
 *           description: Date update.
 *         customerId:
 *           type: integer
 *           description: The id of the customer to whom the car belongs
 *         driverId:
 *           type: integer
 *           description: The id of the driver to whom the car belongs
 *         status:
 *           type: string
 *           description: status trip
 */

/**
 * @swagger
 * /api/trips:
 *   post:
 *     summary: Add a new trip
 *     tags: [Trips]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TripPayload'
 *     responses:
 *       201:
 *         description: Trip added successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Trip'
 *       400:
 *         description: Bad Request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Trip not found
 */
tripRouter.post(
  "/",
  isAuthenticated,
  isBodyValid(tripPayloadSchema),
  driverExists(ParamType.BODY_PARAM),
  isTripDriver,
  customerExists(ParamType.BODY_PARAM),
  createTripController
);
