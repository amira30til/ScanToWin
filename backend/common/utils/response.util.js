const { HttpStatusCodes } = require('../constants/http.constants');

class ApiResponse {
  static success(statusCode = HttpStatusCodes.SUCCESS, data = null) {
    return {
      statusCode,
      data,
    };
  }

  static error(
    statusCode = HttpStatusCodes.INTERNAL_SERVER_ERROR,
    error = null,
  ) {
    return {
      statusCode,
      error,
    };
  }
}

module.exports = { ApiResponse };
