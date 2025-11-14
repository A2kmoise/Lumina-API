import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { TransporterModule } from './transporter/transporter.module';

@Module({
  imports: [UserModule, TransporterModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
