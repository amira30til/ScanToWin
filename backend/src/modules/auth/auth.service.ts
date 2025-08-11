import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Admin } from '../admins/entities/admin.entity';
import { Repository } from 'typeorm';
import {
  AuthMessages,
  UserMessages,
} from 'src/common/constants/messages.constants';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { handleServiceError } from 'src/common/utils/error-handler.util';
import {
  ApiResponseInterface,
  ErrorResponseInterface,
} from 'src/common/interfaces/response.interface';
import { HttpStatusCodes } from 'src/common/constants/http.constants';
import { ApiResponse } from 'src/common/utils/response.util';
import { MailService } from '../mail/mail.service';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { Response } from 'express';
import { AdminStatus } from '../admins/enums/admin-status.enum';

export interface JwtPayload {
  sub: string;
  email: string;
  iat?: number;
  exp?: number;
}

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Admin) private adminsRepository: Repository<Admin>,
    private jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}
  /*------------------------------ SIMPLE LOGIN ------------------------------*/
  async login(dto: LoginDto, res: Response) {
    try {
      const { email, password } = dto;

      const user = await this.adminsRepository
        .createQueryBuilder('user')
        .where('user.email = :email', {
          email: email.toLowerCase(),
        })
        .addSelect(['user.password', 'user.adminStatus'])
        .getOne();

      if (!user) {
        throw new NotFoundException(UserMessages.EMAIL_USER_NOT_FOUND('email'));
      }

      if (user.adminStatus !== AdminStatus.ACTIVE) {
        throw new UnauthorizedException('Your account is not active');
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new UnauthorizedException(AuthMessages.INVALID_PASSWORD);
      }

      const payload = {
        sub: user.id,
        email: user.email,
        role: user.role,
      };

      const accessToken = await this.jwtService.signAsync(payload, {
        secret: `${process.env.JWT_SECRET}`,
        expiresIn: `${process.env.JWT_EXPIRED}`,
      });

      const refreshToken = await this.jwtService.signAsync(payload, {
        secret: `${process.env.REFRESH_JWT_SECRET}`,
        expiresIn: `${process.env.REFRESH_JWT_EXPIRED}`,
      });

      this.setRefreshTokenCookie(res, refreshToken);
      user.refreshToken = refreshToken;
      await this.adminsRepository.save(user);

      return { accessToken, user };
    } catch (error) {
      return handleServiceError(error);
    }
  }

  /*------------------------------ REFRESH TOKEN ------------------------------*/
  async refreshToken(
    refreshToken: string,
  ): Promise<ApiResponseInterface<any> | ErrorResponseInterface> {
    try {
      if (!refreshToken) {
        throw new NotFoundException(UserMessages.USER_REFRESH_TOKEN_NOT_FOUND);
      }

      const payload = await this.jwtService.verifyAsync<JwtPayload>(
        refreshToken,
        {
          secret: process.env.REFRESH_JWT_SECRET,
        },
      );

      const user = await this.adminsRepository.findOne({
        where: { id: payload.sub },
        select: ['id', 'email', 'role', 'refreshToken'],
      });

      if (!user) {
        throw new NotFoundException(UserMessages.USER_REFRESH_TOKEN_NOT_FOUND);
      }

      if (!user.refreshToken) {
        throw new UnauthorizedException(
          'Invalid refresh token: User has no stored refresh token',
        );
      }

      const newPayload = {
        sub: user.id,
        email: user.email,
        role: user.role,
      };

      const newAccessToken = await this.jwtService.signAsync(newPayload, {
        secret: `${process.env.JWT_SECRET}`,
        expiresIn: `${process.env.JWT_EXPIRED}`,
      });

      await this.adminsRepository.save(user);

      return ApiResponse.success(HttpStatusCodes.SUCCESS, {
        role: user.role,
        accessToken: newAccessToken,
      });
    } catch (error) {
      return handleServiceError(error);
    }
  }

  /*---------------------------- LOGOUT ----------------------------*/
  async logout(
    refreshToken: string,
    res: Response,
  ): Promise<ApiResponseInterface<any> | ErrorResponseInterface> {
    try {
      if (!refreshToken) {
        throw new NotFoundException(UserMessages.USER_REFRESH_TOKEN_NOT_FOUND);
      }

      const user = await this.adminsRepository.findOne({
        where: { refreshToken },
      });

      if (!user) {
        this.clearRefreshTokenCookie(res);
        throw new NotFoundException(UserMessages.USER_REFRESH_TOKEN_NOT_FOUND);
      }

      user.refreshToken = null;
      await this.adminsRepository.save(user);

      this.clearRefreshTokenCookie(res);

      return ApiResponse.success(HttpStatusCodes.SUCCESS, 'Logout successful');
    } catch (error) {
      return handleServiceError(error);
    }
  }

  /*---------------------------- COOKIE HELPERS ----------------------------*/
  private setRefreshTokenCookie(res: Response, token: string) {
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development', // Use secure cookies in production
      sameSite: 'strict' as const,
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days (should match the JWT expiry)
      path: '/',
    };

    res.cookie('refresh_token', token, cookieOptions);
  }

  private clearRefreshTokenCookie(res: Response) {
    res.clearCookie('refresh_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      sameSite: 'strict' as const,
      path: '/',
    });
  }

  /*---------------------------- FORGOT PASSWORD ----------------------------*/
  async forgotPasswordWithEmail(
    email: string,
  ): Promise<ApiResponseInterface<any> | ErrorResponseInterface> {
    try {
      const user = await this.adminsRepository.findOne({ where: { email } });
      if (!user) {
        throw new NotFoundException(UserMessages.EMAIL_USER_NOT_FOUND(email));
      }
      const code = this.mailService.generateEmailCode();
      await this.mailService.sendMailForget({
        from: process.env.MAIL_FROM || 'tilouchamira@gmail.com',
        receiverEmail: email,
        subject: 'Forgot Password',
        code,
      });
      user.verificationCode = code;
      await this.adminsRepository.save(user);
      return ApiResponse.success(
        HttpStatusCodes.SUCCESS,
        AuthMessages.FORGOT_PASSWORD_EMAIL_SENT,
      );
    } catch (error) {
      return handleServiceError(error);
    }
  }
  /*----------------------------  RESET Password ----------------------------*/
  async resetPassword(
    dto: ResetPasswordDto,
  ): Promise<ApiResponseInterface<any> | ErrorResponseInterface> {
    try {
      const { email, verificationCode, newPassword } = dto;

      // Find user by email
      const user = await this.adminsRepository.findOne({
        where: { email },
        select: ['id', 'email', 'verificationCode', 'password'],
      });

      if (!user) {
        throw new NotFoundException(UserMessages.EMAIL_USER_NOT_FOUND(email));
      }

      if (
        !user.verificationCode ||
        user.verificationCode !== verificationCode
      ) {
        throw new UnauthorizedException(AuthMessages.INVALID_RESET_CODE);
      }

      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(newPassword, salt);

      user.password = hashedPassword;
      user.verificationCode = null;

      await this.adminsRepository.save(user);

      return ApiResponse.success(
        HttpStatusCodes.SUCCESS,
        AuthMessages.PASSWORD_RESET_SUCCESS ||
          'Password has been reset successfully',
      );
    } catch (error) {
      return handleServiceError(error);
    }
  }
}
