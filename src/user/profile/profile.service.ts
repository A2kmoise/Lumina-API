import { PrismaService } from "src/prisma/prisma.service";
import { ProfileDto } from "../dto";
import { Injectable, NotFoundException } from "@nestjs/common";
import { CloudinaryService } from "src/cloudinary/cloudinary.service";


@Injectable()
export class ProfileService {
  constructor(
    private prisma: PrismaService,
    private cloudinary: CloudinaryService
  ) { }

  async updateProfile(userId: string, dto: ProfileDto) {

    const updateData: any = {};
    if (dto.username) updateData.username = dto.username;
    if (dto.telephone) updateData.telephone = dto.telephone;
    if (dto.email) updateData.email = dto.email;

    if (dto.email) {
      const existingEmail = await this.prisma.user.findUnique({
        where: { email: String(dto.email) },
      });
      if (existingEmail && existingEmail.id !== userId) {
        throw new Error('Email already in use');
      }


    }

    if (dto.telephone) {
      const existingTelephone = await this.prisma.user.findUnique({
        where: { telephone: String(dto.telephone) },
      });

      if (existingTelephone && existingTelephone.id !== userId) {
        throw new Error('Telephone already in use');
      }

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

    return {
      message: "Profile updated successfully",
      UpdatedProfile
    }
  }


  async deleteProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { imageUrl: true, imagePublicId: true }

    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user?.imagePublicId) {
      try {
        await this.cloudinary.deleteImage(user.imagePublicId)
      } catch (error) {
        console.error('The avatar does not exist or failed to delete avatar #lumina')
      }
    }

    await this.prisma.user.delete({
      where: { id: userId },
    });

    return {
      message: "Your account is deleted! Goodbye!"
    }
  }

  async uploadProfilePhoto(userId: string, buffer: Buffer) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        select: { imagePublicId: true }
      });

      if (!user) {
        throw new NotFoundException("User not found")
      }

      if (user.imagePublicId) {
        try {
          await this.cloudinary.deleteImage(user.imagePublicId)
        } catch (error) {
          throw new Error("Failed to delete the photo")
        }
      }

      const uploadResult = await this.cloudinary.uploadBuffer(buffer, "lumina_profiles", `user_${userId}_${Date.now()}`)

      const updatedUser = await this.prisma.user.update({
        where: { id: userId },
        data: {
          imageUrl: uploadResult.secure_url,
          imagePublicId: uploadResult.public_id
        },
        select: {
          id: true,
          username: true,
          email: true,
          imageUrl: true
        }

      });

      return {
        message: "Profile image updated with success",
        userId: updatedUser.id,
        username: updatedUser.username,
        email: updatedUser.email
      }
    } catch (error) {
      throw new Error(`Photo upload failed"${error.message}`)
    }
  }

  async removeProfilePhoto(userId: string) {
try{
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { imageUrl: true, imagePublicId: true }
    })

    if (!user) {
      throw new NotFoundException("user not found")
    }

    if (!user.imagePublicId) {
      return {
        message: "No profile photo to delete"
      }
    }
    await this.cloudinary.deleteImage(user.imagePublicId)

    const updatedUser = await this.prisma.user.update({
      where: {id: userId},
      data: {
        imagePublicId: null,
        imageUrl: null
      },
      select: {
        id: true,
        username:true,
        email: true,
        imageUrl: true
      }

    })
    return{
      message:"Profile photo removed successfully",
      user: updatedUser
    }
  } catch(error){
    throw new Error("Failed to remove the profile photo")
  }
  }

}