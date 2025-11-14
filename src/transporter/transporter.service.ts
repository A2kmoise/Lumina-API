import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "src/prisma/prisma.service";
import { LoginDto, SignupDto } from "./dto";
import { BadRequestException, InternalServerErrorException } from "@nestjs/common";
import * as bcrypt from 'bcrypt';
import { access } from "fs";
import { Server } from "http";

export class TransporterService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService

  ) { }

  async signUp(dto: SignupDto) {
    if (!dto.email || !dto.password || !dto.firstName || !dto.lastName || !dto.telephone || !dto.carCapacity || !dto.carDetails || !dto.licenseNumber || !dto.gpsSerialNumber) {
      throw new BadRequestException("All fields are required");
    }
    const checkTransporter = await this.prisma.driver.findUnique({
      where: {
        email: dto.email,
      },
    })
    if (checkTransporter) {
      throw new BadRequestException("Transporter with this email already exists");
    }

    const salt = await bcrypt.genSalt()
    const hash = await bcrypt.hash(dto.password, salt)
    const transporter = await this.prisma.driver.create({
      data: {
        email: dto.email,
        password: hash,
        firstName: dto.firstName,
        lastName: dto.lastName,
        telephone: dto.telephone,
        licenseNumber: dto.licenseNumber,
        carDetails: dto.carDetails,
        carCapacity: dto.carCapacity,
        gpsSerialNumber: dto.gpsSerialNumber,
      },
    });
    const tokens = await this.generateToken(transporter.id, transporter.email);
    await this.updateRefreshToken(transporter.id, tokens.refreshToken);

    return {
      message: ('transporter registered successfully '),
      transporterID: transporter.id,
      transporterEmail: transporter.email,
      accessTOken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };

  }

  async login(dto: LoginDto) {
    if (!dto.email || !dto.password) {
      throw new BadRequestException("All fields are required");
    }

    const transporter = await this.prisma.driver.findUnique({
      where: {
        email: dto.email,
      },
    });
    if (!transporter) {
      throw new BadRequestException("Invalid credentials");
    }

    const passwordMatches = await bcrypt.compare(dto.password, transporter.password);
    if (!passwordMatches) {
      throw new BadRequestException("Invalid credentials");
    }

    const tokens = await this.generateToken(transporter.id, transporter.email);

    await this.updateRefreshToken(transporter.id, tokens.refreshToken);
    return {
      message: "transporter logged in successfully",
      transporterID: transporter.id,
      transporterEmail: transporter.email,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  }
  async logout(transporterId: string) {
    await this.prisma.driver.update({
      where: {
        id: transporterId,
        refreshToken: {
          not: null,
        },
      },
      data: {
        refreshToken: null,
      },
    });
    return {
      message: "transporter logged out successfully"
    }
  }




  async generateToken(transporterId: string, email: string) {
    const payload = { sub: transporterId, email };
    const accessToken = await this.jwt.signAsync(payload, {
      secret: process.env.JWT_ACCESS_SECRET,
      expiresIn: '15m',
    });

    const refreshToken = await this.jwt.signAsync(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: '7d',
    });


    return {
      accessToken,
      refreshToken,
    };
  }

  async updateRefreshToken(transporterId: string, refreshToken: string) {
    const salt = await bcrypt.genSalt();
    const hashedToken = await bcrypt.hash(refreshToken, salt);
    await this.prisma.driver.update({
      where: { id: transporterId },
      data: { refreshToken: hashedToken },
    });
  }

  async refreshTokens(refreshToken: string) {
    try {
      const payload = await this.jwt.verifyAsync(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });

      const transporter = await this.prisma.driver.findUnique({
        where: { id: payload.sub },
      });

      if (!transporter || !transporter.refreshToken) {
        throw new BadRequestException('Access Denied');
      }

      const refreshTokenMatches = await bcrypt.compare(refreshToken, transporter.refreshToken);

      if (!refreshTokenMatches) {
        throw new BadRequestException('Access Denied');
      }

      const tokens = await this.generateToken(transporter.id, transporter.email);

      await this.updateRefreshToken(transporter.id, tokens.refreshToken);

      return tokens;
    } catch (error) {
      throw new InternalServerErrorException('Could not refresh tokens');
    }

  }

}