import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "src/prisma/prisma.service";

export class TransporterService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService
    
  ) {}

  signUp() {
    //here is sign up logic
  }
  
  login() {
    //here is login logic
  } 
  logout() {
    //here is logout logic
  }
}