import { IsString, IsEmail, IsNotEmpty, IsOptional, IsNumber, IsStrongPassword, MinLength, ValidateIf } from 'class-validator';

export class SignupDto {
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
  @IsStrongPassword()
  @MinLength(6)
  password: string;

  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  licenseNumber: string;

  @IsString()
  @IsNotEmpty()
  carDetails: string;

  @IsNumber()
  @IsNotEmpty()
  carCapacity: number;

  @IsString()
  @IsNotEmpty()
  gpsSerialNumber: string;
}