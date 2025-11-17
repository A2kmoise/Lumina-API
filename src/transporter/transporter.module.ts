import { Module } from '@nestjs/common';
import { TransporterService } from './transporter.service';
import { TransporterController } from './transporter.controller';
import { TransporterAuthModule } from './auth/transporter-auth.module';
import { ProfileController } from './profile/profile.controller';
import { ProfileModule } from './profile/profile.module';

@Module({
  imports: [TransporterAuthModule, ProfileModule],
  controllers: [TransporterController, ProfileController],
  providers: [TransporterService]
})
export class TransporterModule {}
