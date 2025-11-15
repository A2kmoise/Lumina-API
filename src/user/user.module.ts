import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserAuthModule } from './auth/user-auth.module';
import { ProfileModule } from './profile/profile.module';

@Module({
  imports: [
    UserAuthModule,
    ProfileModule,
  ],
  providers: [UserService],
  controllers: [UserController]
})
export class UserModule {}
