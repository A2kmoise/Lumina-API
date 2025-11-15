import { Module } from "@nestjs/common";
import { ProfileService } from "./profile.service";

@Module({
  imports: [],
  controllers: [],
  providers: [ProfileService],
})
export class ProfileModule { }
