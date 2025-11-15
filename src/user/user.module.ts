import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserAuthModule } from './auth/user-auth.module';
import { UserJwtStrategy } from './strategy/jwt.strategy';
import { ProfileModule } from './profile/profile.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserAuthGuard } from './guard/jwt-auth.guard';
import { Prisma } from 'generated/prisma';
import { PrismaService } from 'src/prisma/prisma.service';
@Module({
  imports: [
    UserAuthModule,
    ProfileModule,
    JwtModule.registerAsync({
      imports: [
        ConfigModule
      ],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET_ACCESS_SECRET'),
        signOptions: { expiresIn: '15m' },
      }),
      inject: [ConfigService],
    }),
  ],
      
  providers: [UserService, UserJwtStrategy, UserAuthGuard,PrismaService, ConfigService],
  controllers: [UserController]
})

export class UserModule {}
