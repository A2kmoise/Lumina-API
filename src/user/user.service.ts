import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {


async signUp() {
    
    return { message: 'User registered successfully' };
  }

  async login() {
    return { message: 'User logged in successfully' };
  }
}
