import { Controller, Patch, Delete } from "@nestjs/common";

@Controller('user-profile')
export class ProfileController {
  constructor() {}
  
 @Patch('update')
 updateProfile() {
   // Implementation for updating user profile
 }
 
 @Delete('delete')
 deleteProfile() {
   // Implementation for deleting user profile
 }
 
}