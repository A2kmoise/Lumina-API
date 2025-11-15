import { IsEmail, IsOptional, IsString, IsStrongPassword } from "class-validator";

export class ProfileDto{

  @IsString()
  @IsOptional()
  username: String;

  @IsEmail()
  @IsOptional()
  email ?: String;

  @IsString()
  @IsOptional() 
  telephone ?: String;

  @IsString()
  @IsOptional()
  @IsStrongPassword()
  password ?: String;
}