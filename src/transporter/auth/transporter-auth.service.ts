import { Injectable, BadRequestException, InternalServerErrorException, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { PrismaService } from "src/prisma/prisma.service";
import { LoginDto, SignupDto } from "../dto";
import * as bcrypt from 'bcrypt';

@Injectable()
export class TransporterAuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService
  ) { }

  async signup(dto: SignupDto) {
    try {
      // Validate that at least email or telephone is provided
      if (!dto.email && !dto.telephone) {
        throw new BadRequestException("Either email or telephone is required");
      }

      // Check if transporter already exists by email or telephone
      const existingTransporter = await this.prisma.driver.findFirst({
        where: {
          OR: [
            dto.email ? { email: dto.email } : {},
            dto.telephone ? { telephone: dto.telephone } : {},
          ].filter(condition => Object.keys(condition).length > 0)
        },
      });

      if (existingTransporter) {
        throw new BadRequestException("Transporter with this email or telephone already exists");
      }

      // Hash password
      const hashedPassword = await this.hashData(dto.password);

      // Create transporter
      const transporter = await this.prisma.driver.create({
        data: {
          email: dto.email || null,
          telephone: dto.telephone || null,
          password: hashedPassword,
          username: dto.username,
          licenseNumber: dto.licenseNumber,
          carDetails: dto.carDetails,
          carCapacity: dto.carCapacity,
          gpsSerialNumber: dto.gpsSerialNumber,
        },
        select: {
          id: true,
          email: true,
          username: true,
          telephone: true,
          licenseNumber: true,
          carDetails: true,
          carCapacity: true,
          gpsSerialNumber: true,
          isAvailable: true,
          createdAt: true,
        }
      });

      // Generate tokens using either email or telephone as identifier
      const identifier = transporter.email || transporter.telephone;
      const tokens = await this.generateTokens(transporter.id, identifier);

      // Store refresh token
      await this.updateRefreshToken(transporter.id, tokens.refreshToken);

      return {
        message: 'Transporter registered successfully',
        transporter,
        ...tokens,
      };

    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      console.error('Signup error:', error);
      throw new InternalServerErrorException("Failed to register transporter");
    }
  }

  async login(dto: LoginDto) {
    try {
      // Validate that at least email or telephone is provided
      if (!dto.email && !dto.telephone) {
        throw new BadRequestException("Either email or telephone is required");
      }

      // Find transporter by email or telephone
      const transporter = await this.prisma.driver.findFirst({
        where: {
          OR: [
            dto.email ? { email: dto.email } : {},
            dto.telephone ? { telephone: dto.telephone } : {},
          ].filter(condition => Object.keys(condition).length > 0)
        },
      });

      if (!transporter) {
        throw new UnauthorizedException("Invalid credentials");
      }

      // Verify password
      const passwordMatches = await bcrypt.compare(dto.password, transporter.password);

      if (!passwordMatches) {
        throw new UnauthorizedException("Invalid credentials");
      }

      // Generate tokens using either email or telephone as identifier
      const identifier = transporter.email || transporter.telephone;
      const tokens = await this.generateTokens(transporter.id, identifier);

      // Update refresh token
      await this.updateRefreshToken(transporter.id, tokens.refreshToken);

      return {
        message: "Transporter logged in successfully",
        transporter: {
          id: transporter.id,
          email: transporter.email,
          telephone: transporter.telephone,
          username: transporter.username,
          isAvailable: transporter.isAvailable,
        },
        ...tokens,
      };

    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      console.error('Login error:', error);
      throw new InternalServerErrorException("Failed to login");
    }
  }

  async logout(transporterId: string) {
    try {
      await this.prisma.driver.updateMany({
        where: {
          id: transporterId,
          refreshToken: { not: null },
        },
        data: { refreshToken: null },
      });

      return {
        message: "Transporter logged out successfully"
      };

    } catch (error) {
      console.error('Logout error:', error);
      throw new InternalServerErrorException("Failed to logout");
    }
  }

  async refreshTokens(refreshToken: string) {
    try {
      // Verify refresh token
      const payload = await this.jwt.verifyAsync(refreshToken, {
        secret: this.config.get<string>('JWT_REFRESH_SECRET'),
      });

      // Find transporter
      const transporter = await this.prisma.driver.findUnique({
        where: { id: payload.sub },
      });

      if (!transporter || !transporter.refreshToken) {
        throw new UnauthorizedException('Access Denied');
      }

      // Verify stored refresh token
      const refreshTokenMatches = await bcrypt.compare(
        refreshToken,
        transporter.refreshToken
      );

      if (!refreshTokenMatches) {
        throw new UnauthorizedException('Access Denied');
      }

      // Generate new tokens
      const identifier = transporter.email || transporter.telephone;
      const tokens = await this.generateTokens(transporter.id, identifier);

      // Update refresh token
      await this.updateRefreshToken(transporter.id, tokens.refreshToken);

      return tokens;

    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      console.error('Refresh token error:', error);
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  // Private helper methods
  private async generateTokens(transporterId: string, identifier: string | null) {
    const payload = {
      sub: transporterId,
      identifier, // Can be email or telephone
      type: 'transporter'
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwt.signAsync(payload, {
        secret: this.config.get<string>('JWT_ACCESS_SECRET'),
        expiresIn: '15m',
      }),
      this.jwt.signAsync(payload, {
        secret: this.config.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: '7d',
      }),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  private async updateRefreshToken(transporterId: string, refreshToken: string) {
    const hashedToken = await this.hashData(refreshToken);

    await this.prisma.driver.update({
      where: { id: transporterId },
      data: { refreshToken: hashedToken },
    });
  }

  private async hashData(data: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(data, salt);
  }
}