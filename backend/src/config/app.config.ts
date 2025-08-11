import { registerAs } from '@nestjs/config';

export default registerAs('config', () => ({
  port: Number(process.env.PORT) || 3000,
  nodenv: process.env.NODE_ENV,
}));
