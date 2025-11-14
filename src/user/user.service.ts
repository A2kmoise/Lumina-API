import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { LoginDto, SignupDto } from './dto';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService
  ) { }

  async signUp(data: SignupDto) {
    if (!data.email || !data.password || !data.firstName || !data.lastName || !data.telephone) {
      throw new BadRequestException('All fields are required');
    }

    try {
      const checkUser = await this.prisma.user.findUnique({
        where: { email: data.email }
      });

      if (checkUser) {
        throw new ConflictException('User already exists');
      }

      const salt = await bcrypt.genSalt();
      const hash = await bcrypt.hash(data.password, salt);

      const user = await this.prisma.user.create({
        data: {
          email: data.email,
          password: hash,
          firstName: data.firstName,
          lastName: data.lastName,
          telephone: data.telephone
        }
      });

      // Generate tokens for the new user
      const tokens = await this.generateTokens(user.id, user.email);

      // Store refresh token in database
      await this.updateRefreshToken(user.id, tokens.refreshToken);

      return {
        message: 'User created successfully',
        userId: user.id,
        userEmail: user.email,
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken
      };

    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new InternalServerErrorException('Signup failed');
    }
  }

  async login(dto: LoginDto) {
    if (!dto.email || !dto.password) {
      throw new BadRequestException('Email and password are required');
    }

    try {
      // Find user by email
      const user = await this.prisma.user.findUnique({
        where: { email: dto.email }
      });

      if (!user) {
        throw new UnauthorizedException('Invalid credentials');
      }

      // Compare passwords
      const passwordMatches = await bcrypt.compare(dto.password, user.password);

      if (!passwordMatches) {
        throw new UnauthorizedException('Invalid credentials');
      }

      // Generate tokens
      const tokens = await this.generateTokens(user.id, user.email);

      // Store refresh token in database
      await this.updateRefreshToken(user.id, tokens.refreshToken);

      return {
        message: 'Login successful',
        userId: user.id,
        userEmail: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken
      };

    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new InternalServerErrorException('Login failed');
    }
  }

  // Refresh access token using refresh token
  async refreshTokens(refreshToken: string) {
    try {
      // Verify the refresh token
      const payload = await this.jwt.verifyAsync(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET
      });

      // Get user from database
      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub }
      });

      if (!user || !user.refreshToken) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      // Compare refresh tokens
      const refreshTokenMatches = await bcrypt.compare(refreshToken, user.refreshToken);
      
      if (!refreshTokenMatches) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      // Generate new tokens
      const tokens = await this.generateTokens(user.id, user.email);

      // Update refresh token in database
      await this.updateRefreshToken(user.id, tokens.refreshToken);

      return tokens;

    } catch (error) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  // Store hashed refresh token in database
  async updateRefreshToken(userId: string, refreshToken: string) {
    const salt = await bcrypt.genSalt();
    const hashedRefreshToken = await bcrypt.hash(refreshToken, salt);

    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: hashedRefreshToken }
    });
  }

  // Logout - remove refresh token
  async logout(userId: string) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: null }
    });

    return { message: 'Logged out successfully' };
  }

  //tokens
  async generateTokens(userId: string, email: string) {
    const payload = { sub: userId, email };

    const accessToken = await this.jwt.signAsync(payload, {
      secret: process.env.JWT_ACCESS_SECRET,
      expiresIn: '15m'
    });

    const refreshToken = await this.jwt.signAsync(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: '7d'
    });

    return {
      accessToken,
      refreshToken
    };
  }
}