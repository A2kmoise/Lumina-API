import { Controller, Post } from "@nestjs/common";
import { TransporterService } from "./transporter.service";

@Controller('transporter')
export class TransporterController {
  constructor(private transporterService: TransporterService) {}

  @Post('signup')
  signup() {
    return this.transporterService.signUp();
  }

  @Post('login')
  login() {
    return this.transporterService.login();
  }

  @Post('logout')
  logout() {
    return this.transporterService.logout();
  }
}