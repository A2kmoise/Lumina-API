import { Module } from '@nestjs/common';
import { TransporterService } from './transporter.service';

@Module({
  providers: [TransporterService]
})
export class TransporterModule {}
