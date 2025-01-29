class ApiError extends Error {
  constructor(message, statusCode, errors = null) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(message = "Bad Request", errors = null) {
    return new ApiError(message, 400, errors);
  }

  static unauthorized(message = "Unauthorized Access") {
    return new ApiError(message, 401);
  }

  static forbidden(message = "Forbidden Access") {
    return new ApiError(message, 403);
  }

  static notFound(message = "Not Found") {
    return new ApiError(message, 404);
  }

  static conflict(message = "Conflict", errors = null) {
    return new ApiError(message, 409, errors);
  }

  static internal(message = "Internal Server Error") {
    return new ApiError(message, 500);
  }
}

export default ApiError;
