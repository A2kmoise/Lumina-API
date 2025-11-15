import { Controller, Patch, Delete, Body } from "@nestjs/common";
import { ProfileService } from "./profile.service";
import { ProfileDto } from "../dto";

@Controller('user-profile')
export class ProfileController {
  constructor(private profileService: ProfileService) {}
  
 @Patch('update/:id')
 updateProfile(@Body() dto: ProfileDto) {
   this.profileService.updateProfile();
 }
 
 @Delete('delete')
 deleteProfile() {
   this.profileService.deleteProfile();
 }

}