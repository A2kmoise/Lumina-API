import { IsString, IsEmail, IsNotEmpty, IsOptional, IsNumber, IsStrongPassword, MinLength } from 'class-validator';

export class SignupDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @IsStrongPassword()
  @MinLength(6)
  password: string;

  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsString()
  @IsNotEmpty()
  telephone: string;

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
