import { ApiError } from "../@shared/errors/api.errors";

export class DriverAlreadyHaveCarError extends ApiError {
  constructor(
    public message = "This driver already have a car.",
    public statusCode = 404
  ) {
    super(message);
  }
}