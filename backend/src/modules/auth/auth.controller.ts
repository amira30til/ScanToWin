import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import {
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
import { RefreshAuthGuard } from './guards/refresh-token.guard';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  /*------------------------------- SIMPLE LOGIN ---------------------------------*/
  @Post()
  @ApiOperation({ summary: 'Login user' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  /*------------------------------- REFRESH TOKEN ---------------------------------*/
  @Post('refresh-token')
  @ApiBearerAuth()
  @UseGuards(RefreshAuthGuard)
  @ApiOperation({ summary: 'Refresh token' })
  refreshToken(@Request() req: any) {
    return this.authService.refreshToken(+req.user.userId);
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
  /*----------------------------  RESET Password ----------------------------*/

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
