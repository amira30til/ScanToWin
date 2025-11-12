const { HttpStatusCodes, HttpMessages } = require('../constants/http.constants');
const { ApiResponse } = require('./response.util');

function handleServiceError(error, logError = true) {
  // Handle known NestJS-style exceptions
  if (error?.statusCode) {
    throw error;
  }

  // Handle MongoDB errors
  if (error?.name === 'MongoError' || error?.name === 'ValidationError') {
    return ApiResponse.error(HttpStatusCodes.BAD_REQUEST, {
      code: error.name,
      message: error.message,
    });
  }

  if (logError) console.error('Unhandled exception:', error);

  return ApiResponse.error(
    HttpStatusCodes.INTERNAL_SERVER_ERROR,
    HttpMessages.INTERNAL_SERVER_ERROR,
  );
}

module.exports = { handleServiceError };
