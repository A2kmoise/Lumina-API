import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { PrismaClient } from '@prisma/client';
import { UserService } from './user.service';
import { JwtModule } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  imports: [JwtModule.register({})],
  controllers: [UserController],
  providers: [UserService, PrismaService]
})
export class UserModule {}
