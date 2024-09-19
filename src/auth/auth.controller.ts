import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { Public } from './public.decorator';
import { ApiTags } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiTags('Public')
  @Public()
  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    const { username, password, roles } = createUserDto;
    return this.authService.register(username, password, roles);
  }

  @ApiTags('Public')
  @Public()
  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto) {
    const { username, password } = loginUserDto;
    const user = await this.authService.validateUser(username, password);
    if (user) {
      return this.authService.login(user);
    } else {
      return { message: 'Invalid credentials' };
    }
  }
}
