import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { ServerResponse } from 'http';
import * as streamifier from 'streamifier';

@Injectable()
export class CloudinaryService {
  constructor(private config: ConfigService) {
    cloudinary.config({
      cloud_name: this.config.get<string>('CLOUDINARY_CLOUD_NAME'),
      api_key: this.config.get<string>('CLOUDINARY_API_KEY'),
      api_secret: this.config.get<string>('CLOUDINARY_API_SECRET'),
    });
  }

  async uploadBuffer(
    buffer: Buffer,
    folder = 'lumina_profiles',
    publicIdPrefix = ''
  ): Promise<UploadApiResponse> {
    return new Promise<UploadApiResponse>((resolve, reject) => {
      const opts: any = {
        folder,
        resource_type: 'image',
        use_filename: false,
        unique_filename: true,
        overwrite: false, 
        transformation: [{ width: 1024, crop: 'limit' }],
      };

      if (publicIdPrefix) opts.public_id = publicIdPrefix; 

      const uploadStream = cloudinary.uploader.upload_stream(
        opts,
        (error, result) => {
          if (error) return reject(error);
          if (!result) return reject(new Error('Upload failed: no results'))
          resolve(result);
        }
      );

      streamifier.createReadStream(buffer).pipe(uploadStream); 
    });
  }

  async deleteImage(publicId: string): Promise<any> {
    try {
      const result = cloudinary.uploader.destroy(publicId,
        {
          resource_type: 'image'
        }
      )
      return result;
    } catch (error) {
      throw new Error("The delete request failed")
    }
  }
}