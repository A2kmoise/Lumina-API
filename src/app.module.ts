import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserAuthModule } from './user/auth/user-auth.module';
import { TransporterAuthModule } from './transporter/auth/transporter-auth.module';
import { UserModule } from './user/user.module';
import { TransporterModule } from './transporter/transporter.module';

@Module({
  imports: [
    UserModule,
    UserAuthModule,
    TransporterModule,
     TransporterAuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
