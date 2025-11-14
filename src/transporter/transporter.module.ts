import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { TransporterController } from "./transporter.controller";
import { TransporterService } from "./transporter.service";
import { Prisma } from "generated/prisma";
import { PrismaService } from "src/prisma/prisma.service";

@Module({
  imports: [JwtModule.register({})],
  controllers: [TransporterController],
  providers: [TransporterService, PrismaService],
})

export class TransporterModule {}