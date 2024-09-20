import { registerAs } from '@nestjs/config';

export default registerAs('config', () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  nodenv: process.env.NODE_ENV,
  secretKey: process.env.SECRET_KEY,
  jwtExpiration: process.env.JWT_EXPIRATION,
  jwtRefreshExpiration: process.env.JWT_REFRESH_EXPIRATION,
  redisHost: process.env.REDIS_HOST,
  redisPort: process.env.REDIS_PORT,
}));
