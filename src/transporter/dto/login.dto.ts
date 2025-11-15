import { IsString, IsEmail, IsNotEmpty, IsOptional, ValidateIf } from 'class-validator';

export class LoginDto {
  @IsEmail()
  @IsOptional()
  @ValidateIf(o => !o.telephone || o.email)
  email?: string;

  @IsString()
  @IsOptional()
  @ValidateIf(o => !o.email || o.telephone)
  telephone?: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}