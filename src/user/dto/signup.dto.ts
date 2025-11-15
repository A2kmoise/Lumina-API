import { IsString, IsOptional, IsNotEmpty, MinLength, IsStrongPassword } from 'class-validator';

export class SignupDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  telephone?: string;

  @IsString()
  @IsStrongPassword()
  @MinLength(6)
  password: string;
}
