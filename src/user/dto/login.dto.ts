import { IsEmail, IsNotEmpty, IsStrongPassword, Min, MinLength } from "class-validator";

export class LoginDto {

  @IsEmail()
  @IsNotEmpty()
  email: string;

@IsNotEmpty()
@IsStrongPassword()
@MinLength(6)
  password: string;
}