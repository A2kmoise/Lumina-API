import { Module } from '@nestjs/common';
import { TransporterService } from './transporter.service';
import { TransporterController } from './transporter.controller';
import { TransporterAuthModule } from './auth/transporter-auth.module';

@Module({
  imports: [TransporterAuthModule],
  controllers: [TransporterController],
  providers: [TransporterService]
})
export class TransporterModule {}
