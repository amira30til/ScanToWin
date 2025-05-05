import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { ApiResponse } from '../utils/response.util';
import { HttpMessages } from '../constants/http.constants';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private logger = new Logger('Exception Error');

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const status = exception.getStatus();
    const exceptionResponse: any = exception.getResponse();
    const message = exceptionResponse.message;
    if (exception instanceof BadRequestException) {
      const customResponse = ApiResponse.error(
        status,
        `Validation Error: ${message}`,
      );
      return response.status(HttpStatus.BAD_REQUEST).json(customResponse);
    }
    if (exception instanceof HttpException) {
      const customResponse = ApiResponse.error(status, message);
      return response.status(status).send(customResponse);
    }
    this.logger.error('Unhandled exceptioneee:', exception);
    const customResponse = ApiResponse.error(
      HttpStatus.INTERNAL_SERVER_ERROR,
      HttpMessages.INTERNAL_SERVER_ERROR,
    );

    return response
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json(customResponse);
  }
}
