import { Controller, Patch, Delete, Body, UseGuards } from "@nestjs/common";
import { ProfileService } from "./profile.service";
import { ProfileDto } from "../dto";
import { UserAuthGuard } from "../guard/jwt-auth.guard";
import { AuthGuard } from "@nestjs/passport";
import { UserJwtStrategy } from "../strategy/jwt.strategy";
import { User } from "../decorator/user.decorator";

@Controller('user-profile')
export class ProfileController {
  constructor(private profileService: ProfileService) { }


  @UseGuards(UserAuthGuard)
  @Patch('update')
  updateProfile(@User('id') userId: string, @Body() dto: ProfileDto) {
    this.profileService.updateProfile(userId, dto);
  }

  @UseGuards(UserAuthGuard)
  @Delete('delete')
  deleteProfile(@User('id') userId: string) {
    this.profileService.deleteProfile(userId);
  }

}