class ApiResponse {
  constructor(statusCode = 200, data, message, error = null) {
    this.status = statusCode;
    this.data = data;
    this.message = message;
    this.error = error;
  }
}

export default ApiResponse;
