import { Module } from '@nestjs/common';
import { UserController } from './user-auth.controller';
import { PrismaClient } from '@prisma/client';
import { UserAuthService } from './user-auth.service';
import { JwtModule } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  imports: [JwtModule.register({})],
  controllers: [UserController],
  providers: [UserAuthService, PrismaService]
})
export class UserAuthModule { }
