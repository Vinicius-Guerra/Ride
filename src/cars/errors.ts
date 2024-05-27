import { ApiError } from "../@shared/errors/api.errors";

export class LicensePlateAlreadyUsedError extends ApiError {
  constructor(
    public message = "License plate already used.",
    public statusCode = 409
  ) {
    super(message);
  }
}

export class CarNotFoundError extends ApiError {
  constructor(public message = "Car not found.", public statusCode = 404) {
    super(message);
  }
}