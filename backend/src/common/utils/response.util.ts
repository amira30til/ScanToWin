import { HttpStatusCodes } from '../constants/http.constants';
import {
  ErrorResponseInterface,
  ApiResponseInterface,
} from '../interfaces/response.interface';

export class ApiResponse {
  static success<T>(
    statusCode: number = HttpStatusCodes.SUCCESS,
    data: any = null,
  ): ApiResponseInterface<T> {
    return {
      statusCode,
      data,
    };
  }

  static error(
    statusCode: number = HttpStatusCodes.INTERNAL_SERVER_ERROR,
    error: any = null,
  ): ErrorResponseInterface {
    return {
      statusCode,
      error,
    };
  }
}
