import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Admin } from '../admins/entities/admin.entity';
import { Auth, Repository } from 'typeorm';
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

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Admin) private adminsRepository: Repository<Admin>,
    private jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}
  /*------------------------------ SIMPLE LOGIN ------------------------------*/
  async login(dto: LoginDto) {
    try {
      const { email, password } = dto;
      const user = await this.adminsRepository
        .createQueryBuilder('user')
        .where('user.email = :email', {
          email: email.toLowerCase(),
        })
        .addSelect('user.password')
        .getOne();

      if (!user) {
        throw new NotFoundException(UserMessages.EMAIL_USER_NOT_FOUND('email'));
      }
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new UnauthorizedException(AuthMessages.INVALID_PASSWORD);
      }
      // Create JWT token for authentication with email
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
      // TODO: why did you comment this out?
      // delete user.password;
      return { accessToken, refreshToken, user };
    } catch (e) {
      return handleServiceError(e);
    }
  }
  /*------------------------------ REFRESH TOKEN ------------------------------*/
  async refreshToken(
    userId: number,
  ): Promise<ApiResponseInterface<Auth> | ErrorResponseInterface> {
    try {
      const user = await this.adminsRepository.findOne({
        where: { id: userId },
      });

      if (!user) {
        throw new NotFoundException(UserMessages.USER_NOT_FOUND(userId));
      }

      const newPayload = {
        sub: user.id,
        email: user.email,
        role: user.role,
      };

      const newToken = await this.jwtService.signAsync(newPayload, {
        secret: `${process.env.JWT_SECRET}`,
        expiresIn: `${process.env.JWT_EXPIRED}`,
      });

      // Optional chaining ensures no error if password is undefined
      if (user.password !== undefined) {
        //delete user.password;
      }

      return ApiResponse.success(HttpStatusCodes.SUCCESS, {
        accessToken: newToken,
      });
    } catch (error) {
      return handleServiceError(error);
    }
  }

  /*---------------------------- FORGOT PASSWORD ----------------------------*/
  async forgotPasswordWithEmail(
    email: string,
  ): Promise<ApiResponseInterface<Auth> | ErrorResponseInterface> {
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
