import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserAuthModule } from './user/auth/user-auth.module';
import { TransporterAuthModule } from './transporter/auth/transporter-auth.module';
import { UserModule } from './user/user.module';
import { TransporterModule } from './transporter/transporter.module';
import { ProfileModule } from './user/profile/profile.module';
import { CloudinaryService } from './cloudinary/cloudinary.service';

@Module({
  imports: [
    UserModule,
    TransporterModule,
    ],
  controllers: [AppController],
  providers: [AppService, CloudinaryService],
})
export class AppModule { }
