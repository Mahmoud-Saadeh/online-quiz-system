// import { Module } from '@nestjs/common';
// import { AuthService } from './auth.service';
// import { AuthController } from './auth.controller';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { User } from './user.entity';
// import { JwtModule } from '@nestjs/jwt';
// import { PassportModule } from '@nestjs/passport';
// import { JwtStrategy } from './jwt.strategy';
// import { ConfigModule, ConfigService } from '@nestjs/config';
// import { LocalStrategy } from './local.strategy';
// import { JwtService } from '@nestjs/jwt';

// @Module({
//   imports: [
//     TypeOrmModule.forFeature([User]),
//     JwtModule.registerAsync({
//       imports: [ConfigModule],
//       inject: [ConfigService],
//       useFactory: async (configService: ConfigService) => {
//         console.log("configService.get('config')", configService.get('config'));

//         return {
//           secret: configService.get('config').secretKey,
//           signOptions: {
//             expiresIn: configService.get('config').jwtExpiration || '3600s',
//           },
//         };
//       },
//     }),
//     // PassportModule,
//   ],
//   providers: [AuthService, LocalStrategy, JwtStrategy, JwtService],
//   controllers: [AuthController],
//   exports: [AuthService],
// })
// export class AuthModule {}
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';

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
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
