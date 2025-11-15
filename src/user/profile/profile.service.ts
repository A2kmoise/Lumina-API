import { PrismaService } from "src/prisma/prisma.service";
import { ProfileDto } from "../dto";

export class ProfileService {
  constructor(private prisma: PrismaService) { }

  async updateProfile(userId: string, dto: ProfileDto) {
  
  const updateData: any = {};
  if (dto.username) updateData.username = dto.username;
  if (dto.telephone) updateData.telephone = dto.telephone;
  if (dto.email) updateData.address = dto.email;

  if (dto.email){
  const existingEmail =  await this.prisma.user.findUnique({
      where: { email: String(dto.email) },
    });
    if(existingEmail) throw new Error('Email already in use');
  
  }

  if (dto.telephone){
    const existingTelephone =  await this.prisma.user.findUnique({
        where: { telephone: String(dto.telephone) },
      });
      if(existingTelephone) throw new Error('Telephone already in use');
    
    }

    const UpdatedProfile = await this.prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        email: true,
        username: true,
        telephone: true,
        createdAt: true,
      }
    });

    return UpdatedProfile;
}


  async deleteProfile(userId: string) {
    await this.prisma.user.delete({
      where: { id: userId },
    });
  }

}