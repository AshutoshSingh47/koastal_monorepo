export class HttpException extends Error {
  public statusCode: number;
  public details?: Record<string, unknown>;

  constructor(statusCode: number, message: string, details?: Record<string, unknown>) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    this.name = this.constructor.name;
    Error.captureStackTrace?.(this, this.constructor);
  }
}

export class BadRequestError extends HttpException {
  constructor(message = "Bad Request", details?: Record<string, unknown>) {
    super(400, message, details);
  }
}

export class NotFoundError extends HttpException {
  constructor(message = "Resource not found", details?: Record<string, unknown>) {
    super(404, message, details);
  }
}

export class UnauthorizedError extends HttpException {
  constructor(message = "Unauthorized", details?: Record<string, unknown>) {
    super(401, message, details);
  }
}

export class ForbiddenError extends HttpException {
  constructor(message = "Forbidden", details?: Record<string, unknown>) {
    super(403, message, details);
  }
}
