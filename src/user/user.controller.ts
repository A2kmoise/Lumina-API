import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { SignupDto, LoginDto } from './dto';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('signup')
  async signUp(@Body() dto: SignupDto) {
    return this.userService.signUp(dto);
  }

  @Post('login')
  async login(@Body() dto: LoginDto) {
    return this.userService.login(dto);
  }

  @Post('refresh')
  async refresh(@Body('refreshToken') refreshToken: string) {
    return this.userService.refreshTokens(refreshToken);
  }

  @Post('logout')
  async logout(@Body('userId') userId: string) {
    return this.userService.logout(userId);
  }
}