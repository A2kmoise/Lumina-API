import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { PrismaClient } from 'generated/prisma';
import { UserService } from './user.service';

@Module({
  controllers: [UserController],
  providers: [UserService]
})
export class UserModule {}
