import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { TransporterController } from "./transporter-auth.controller";
import { TransporterAuthService } from "./transporter-auth.service";
import { PrismaService } from "src/prisma/prisma.service";
import { ConfigModule } from "@nestjs/config";

@Module({
  imports: [JwtModule.register({}), ConfigModule],
  controllers: [TransporterController],
  providers: [TransporterAuthService, PrismaService],
})

export class TransporterAuthModule { }