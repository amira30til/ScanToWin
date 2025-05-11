import { Controller, Post, Body, UseGuards, Req, Res } from '@nestjs/common';
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
import { Response, Request } from 'express';

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
  refreshToken(
    @Req() request: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken = request.cookies.refresh_token as string;
    return this.authService.refreshToken(refreshToken, res);
  }

  /*------------------------------- LOGOUT ---------------------------------*/
  @Post('logout')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Logout user' })
  async logout(
    @Req() request: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken = request.cookies.refresh_token as string;
    return this.authService.logout(refreshToken, res);
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
