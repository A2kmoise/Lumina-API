import { IsEmail, IsNotEmpty, IsStrongPassword, MinLength } from "class-validator";

export class LoginDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  @IsStrongPassword()
  password: string;
}