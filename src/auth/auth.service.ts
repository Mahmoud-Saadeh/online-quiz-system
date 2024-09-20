import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcryptjs';
import { ConfigService } from '@nestjs/config';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { RefreshTokenIdsStorage } from './refresh-token-ids.storage';
import { randomUUID } from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
    private configService: ConfigService,
    private refreshTokenIdsStorage: RefreshTokenIdsStorage,
  ) {}

  async register(username: string, password: string, roles: string[]) {
    // Check if user already exists
    const existingUser = await this.userRepository.findOne({
      where: { username },
    });

    if (existingUser) {
      throw new ConflictException('User with this username already exists');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.userRepository.create({
      username,
      password: hashedPassword,
      roles,
    });
    const savedUser = await this.userRepository.save(user);
    const payload = {
      username: savedUser.username,
      sub: savedUser.id,
      roles: savedUser.roles,
    };
    return this.signToken(payload);
  }

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.userRepository.findOne({ where: { username } });

    if (user && (await bcrypt.compare(password, user.password))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = {
      username: user.username,
      sub: user.id,
      roles: user.roles,
    };
    return this.signToken(payload);
  }

  async refreshTokens(refreshTokenDto: RefreshTokenDto) {
    try {
      const { sub, refreshTokenId } = await this.jwtService.verifyAsync(
        refreshTokenDto.refreshToken,
      );
      const user = await this.userRepository.findOneOrFail({
        where: { id: sub },
      });
      const isValid = await this.refreshTokenIdsStorage.validate(
        user.id,
        refreshTokenId,
      );
      if (isValid) {
        await this.refreshTokenIdsStorage.invalidate(user.id);
      } else {
        throw new Error('Refresh Token is invalid');
      }
      return this.signToken({
        username: user.username,
        sub: user.id,
        roles: user.roles,
      });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      throw new UnauthorizedException();
    }
  }

  private async signToken(payload?: {
    username: string;
    sub: number;
    roles: string[];
  }) {
    const refreshTokenId = randomUUID();
    const token = {
      access_token: this.jwtService.sign(payload),
      refresh_token: this.jwtService.sign(
        { ...payload, refreshTokenId },
        {
          expiresIn:
            this.configService.get('config').jwtRefreshExpiration || '3600s',
        },
      ),
    };

    await this.refreshTokenIdsStorage.insert(payload.sub, refreshTokenId);

    return token;
  }
}
