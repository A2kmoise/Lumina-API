import { IsEmail, IsNotEmpty, IsString, IsStrongPassword, MinDate, MinLength } from "class-validator";

export class SignupDto {

  @IsEmail()
  @IsNotEmpty()
  email: string;

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

  @IsNotEmpty()
  telephone: string;
}