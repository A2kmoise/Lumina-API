import { Body, Controller, Post } from "@nestjs/common";
import { TransporterAuthService } from "./transporter-auth.service";
import { LoginDto, SignupDto } from "../dto";

@Controller('transporter')
export class TransporterController {
  constructor(private transporterService: TransporterAuthService) { }

  @Post('signup')
  signup(@Body() dto: SignupDto) {
    return this.transporterService.signup(dto);
  }

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.transporterService.login(dto);
  }
  @Post('refresh')
  refresh(@Body('refreshToken') refreshToken: string) {
    return this.transporterService.refreshTokens(refreshToken);
  }

  @Post('logout')
  logout(@Body('transporterId') transporterId: string) {
    return this.transporterService.logout(transporterId);
  }
}