import { Controller, Patch, Delete, Body, UseGuards, UseInterceptors, UploadedFile } from "@nestjs/common";
import { ProfileService } from "./profile.service";
import { ProfileDto } from "../dto";
import { UserAuthGuard } from "../guard/jwt-auth.guard";
import { AuthGuard } from "@nestjs/passport";
import { UserJwtStrategy } from "../strategy/jwt.strategy";
import { User } from "../decorator/user.decorator";
import { FileInterceptor } from "@nestjs/platform-express";
import { memoryStorage } from "multer";

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

@UseGuards(UserAuthGuard)
@Patch('avatar')
@UseInterceptors(FileInterceptor('file',{
  storage: memoryStorage(),
  limits: { fileSize: 5*1024*1024},
  fileFilter: (req, file, cb) => {
    if(!file.mimetype.match(/\/(jpg|jpeg|png|webp)$/)){
      return cb(new Error('only jpg,jpeg,png and webp are only allowed@'), false)
    }
  cb(null,true)
  }
}
))
uploadProfilephoto(@User('id') userId: string, @UploadedFile() file: Express.Multer.File){
  if (!file){
    throw new Error("No file provided");
  }
  return this.profileService.uploadProfilePhoto(userId, file.buffer)
}

@UseGuards(UserAuthGuard)
@Delete('deleteAvatar')
deleteProfilephoto(@User('id') userId: string){}
}