import {
    BadRequestException,
    ConflictException,
    NotFoundException,
    UnauthorizedException,
  } from '@nestjs/common';
  import { QueryFailedError } from 'typeorm';

import { HttpMessages, HttpStatusCodes } from '../constants/http.constants';
import { ApiResponseInterface, ErrorResponseInterface } from '../interfaces/response.interface';
import { ApiResponse } from './response.util';
 
  
  export function handleServiceError(
    error: any,
    logError: boolean = true,
  ): ApiResponseInterface<any> | ErrorResponseInterface {
    if (
      error instanceof NotFoundException ||
      error instanceof BadRequestException ||
      error instanceof ConflictException ||
      error instanceof UnauthorizedException
    ) {
      throw error;
    }
  
    if (error instanceof QueryFailedError) {
      return ApiResponse.error(
        HttpStatusCodes.BAD_REQUEST,
        `Database error: ${error.message}`,
      );
    }
  
    if (logError) console.error('Unhandled exception:', error);
  
    return ApiResponse.error(
      HttpStatusCodes.INTERNAL_SERVER_ERROR,
      HttpMessages.INTERNAL_SERVER_ERROR,
    );
  }
  