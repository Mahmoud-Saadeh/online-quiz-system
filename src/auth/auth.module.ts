import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RefreshTokenIdsStorage } from './refresh-token-ids.storage';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          secret: configService.get('config').secretKey,
          signOptions: {
            expiresIn: configService.get('config').jwtExpiration || '3600s',
          },
        };
      },
    }),
  ],
  providers: [AuthService, JwtStrategy, RefreshTokenIdsStorage],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
