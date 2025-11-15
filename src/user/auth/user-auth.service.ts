import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { LoginDto, SignupDto } from '../dto';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserAuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService
  ) { }

  async signUp(data: SignupDto) {
    if (!data.email && !data.telephone) {
      throw new BadRequestException('Email or telephone is required');
    }

    try {


      if (data.email) {
        const existingEmail = await this.prisma.user.findUnique({
          where: { email: data.email }
        });

        if (existingEmail) {
          throw new ConflictException('User with this email already exists');
        }
      }

      if (data.telephone) {
        const existingTelephone = await this.prisma.user.findUnique({
          where: { telephone: data.telephone }
        });

        if (existingTelephone) {
          throw new ConflictException('User with this telephone already exists');
        }
      }

      const salt = await bcrypt.genSalt();
      const hash = await bcrypt.hash(data.password, salt);

      const user = await this.prisma.user.create({
        data: {
          username: data.username,
          email: data.email,
          password: hash,
          telephone: data.telephone
        }
      });

      // Generate tokens for the new user
      const tokens = await this.generateTokens(user.id, user.email || user.telephone);

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
    try {

      const user = await this.prisma.user.findFirst({
        where: {
          OR: [
            { email: dto.identifier },
            { telephone: dto.identifier }
          ]
        }
      });

      if (!user) {
        throw new UnauthorizedException('Invalid credentials');
      }


      const passwordMatches = await bcrypt.compare(dto.password, user.password);

      if (!passwordMatches) {
        throw new UnauthorizedException('Invalid credentials');
      }


      const tokens = await this.generateTokens(user.id, user.email, user.telephone);


      await this.updateRefreshToken(user.id, tokens.refreshToken);

      return {
        message: 'Login successful',
        userId: user.id,
        Credential: user.email || user.telephone,
        username: user.username,
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


  async refreshTokens(refreshToken: string) {
    try {

      const payload = await this.jwt.verifyAsync(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET
      });


      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub }
      });

      if (!user || !user.refreshToken) {
        throw new UnauthorizedException('Invalid refresh token');
      }


      const refreshTokenMatches = await bcrypt.compare(refreshToken, user.refreshToken);

      if (!refreshTokenMatches) {
        throw new UnauthorizedException('Invalid refresh token');
      }


      const tokens = await this.generateTokens(user.id, user.email, user.telephone);


      await this.updateRefreshToken(user.id, tokens.refreshToken);

      return tokens;

    } catch (error) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }


  async updateRefreshToken(userId: string, refreshToken: string) {
    const salt = await bcrypt.genSalt();
    const hashedRefreshToken = await bcrypt.hash(refreshToken, salt);

    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: hashedRefreshToken }
    });
  }


  async logout(userId: string) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: null }
    });

    return { message: 'Logged out successfully' };
  }


  async generateTokens(userId: string, email?: string | null, telephone?: string | null) {
    const payload = { sub: userId, identifier: email || telephone };

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