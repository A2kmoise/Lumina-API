import { IsEmail, IsNotEmpty, IsString, IsStrongPassword, Min, MinLength } from "class-validator";

export class LoginDto {

  @IsString()
  @IsNotEmpty()
  identifier: string;

  @IsNotEmpty()
  @IsStrongPassword()
  @MinLength(6)
  password: string;
}