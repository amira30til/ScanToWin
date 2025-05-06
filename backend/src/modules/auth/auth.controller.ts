import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import {
  ApiOperation,
  ApiResponse as SwaggerResponse,
  ApiBearerAuth,
  ApiBody,
  ApiCookieAuth,
} from '@nestjs/swagger';
import { RefreshAuthGuard } from './guards/refresh-token.guard';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { Response } from 'express';
import { JwtAuthGuard } from './guards/jwt-auth.guards';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /*------------------------------- SIMPLE LOGIN ---------------------------------*/
  @Post()
  @ApiOperation({ summary: 'Login user' })
  @SwaggerResponse({ status: 200, description: 'Login successful' })
  @SwaggerResponse({ status: 401, description: 'Unauthorized' })
  login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {
    return this.authService.login(dto, res);
  }

  /*------------------------------- REFRESH TOKEN ---------------------------------*/
  @ApiOperation({
    summary: 'Refresh token using cookie',
    description:
      'This endpoint requires a refresh token passed in the cookies to generate a new access token. The token should be set as `refresh_token`.',
  })
  @Post('refresh-token')
  @ApiCookieAuth()
  @UseGuards(RefreshAuthGuard)
  @ApiOperation({ summary: 'Refresh token using cookie' })
  refreshToken(@Request() req: any, @Res({ passthrough: true }) res: Response) {
    return this.authService.refreshToken(
      +req.user.userId,
      req.cookies.refresh_token,
      res,
    );
  }

  /*------------------------------- LOGOUT ---------------------------------*/
  @Post('logout')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Logout user' })
  async logout(@Request() req: any, @Res({ passthrough: true }) res: Response) {
    return this.authService.logout(+req.user.userId, res);
  }

  /*------------------------------ FORGOT PASSWORD --------------------------------*/
  @Post('/forgot-password')
  @ApiBody({
    schema: {
      example: { email: 'email@example.com' },
      properties: {
        email: {
          type: 'string',
          example: 'email@example.com',
        },
      },
    },
  })
  @ApiOperation({ summary: 'Forgot password' })
  forgotPassword(@Body('email') email: string) {
    return this.authService.forgotPasswordWithEmail(email);
  }

  /*---------------------------- RESET Password ----------------------------*/
  @Post('reset-password')
  @ApiBody({
    description:
      'Reset password with email, verification code, and new password',
    schema: {
      type: 'object',
      properties: {
        email: {
          type: 'string',
          example: 'email@example.com',
        },
        verificationCode: {
          type: 'string',
          example: '123456',
        },
        newPassword: {
          type: 'string',
          example: 'MySecurePassword123',
          minLength: 8,
        },
      },
      required: ['email', 'verificationCode', 'newPassword'],
    },
  })
  @ApiOperation({ summary: 'Reset password' })
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetPasswordDto);
  }
}
