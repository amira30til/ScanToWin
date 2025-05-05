import { JwtModuleOptions } from '@nestjs/jwt';
import * as dotenv from 'dotenv';
import { registerAs } from '@nestjs/config';

dotenv.config();
export const config: JwtModuleOptions = {
  secret: process.env.JWT_SECRET,
  signOptions: { expiresIn: process.env.JWT_EXPIRED },
  global: true,
};

export default registerAs('jwt', () => config);
