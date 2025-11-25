import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ConfigModule } from '@nestjs/config';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  imports: [ConfigModule],
  providers: [ProfileService, CloudinaryService, PrismaService]
})
export class ProfileModule { }
