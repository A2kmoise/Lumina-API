import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { LoginDto, SignupDto } from './dto';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) { }


  @Post('register')
  SignUp(@Body() data: SignupDto) {
    this.userService.signUp();
  }

  @Post('login')
  SignIn(@Body() data: LoginDto) {
    this.userService.login();
  }

}
