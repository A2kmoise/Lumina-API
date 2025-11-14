import { Body, Controller, Post } from "@nestjs/common";
import { TransporterService } from "./transporter.service";
import { Sign } from "crypto";
import { LoginDto, SignupDto } from "./dto";

@Controller('transporter')
export class TransporterController {
  constructor(private transporterService: TransporterService) {}

  @Post('signup')
  signup(@Body() dto: SignupDto) {
    return this.transporterService.signUp(dto);
  }

  @Post('login')
  login(@Body() dto:LoginDto) {
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