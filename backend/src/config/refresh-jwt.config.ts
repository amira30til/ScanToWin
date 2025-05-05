import * as dotenv from 'dotenv';
import { JwtSignOptions } from '@nestjs/jwt';
import { registerAs } from '@nestjs/config';

dotenv.config();
export const refreshConfig: JwtSignOptions = {
  secret: process.env.REFRESH_JWT_SECRET,
  expiresIn: process.env.REFRESH_JWT_EXPIRED,
};

export default registerAs('refresh-jwt', () => refreshConfig);
