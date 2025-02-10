import type { z } from "zod";
import { Logger } from "@/server/utils/logger";

const logger = Logger.for("ErrorHandler");

export class BaseError extends Error {
  constructor(
    message: string,
    public readonly cause?: Error,
    public readonly context?: Record<string, unknown>,
  ) {
    super(message);
    this.name = "Error";
  }
}

export class ValidationError extends BaseError {
  constructor(
    message: string,
    cause?: Error,
    context?: Record<string, unknown>,
  ) {
    super(message, cause, context);
    this.name = "ValidationError";
  }
}

export class NetworkError extends BaseError {
  constructor(
    message: string,
    cause?: Error,
    context?: Record<string, unknown>,
  ) {
    super(message, cause, context);
    this.name = "NetworkError";
  }
}

export function handleZodError(
  error: z.ZodError,
  context?: Record<string, unknown>,
): ValidationError {
  const issues = JSON.stringify(error.issues, null, 2);
  logger.error("Validation error", { error: issues, context });
  return new ValidationError(
    `Schema validation failed: ${issues}`,
    error,
    context,
  );
}

export function handleNetworkError(
  error: Error,
  url: string,
  context?: Record<string, unknown>,
): NetworkError {
  logger.error("Network request failed", {
    error: error.message,
    url,
    context,
  });
  return new NetworkError(
    `Failed to fetch data from ${url}: ${error.message}`,
    error,
    context,
  );
}
