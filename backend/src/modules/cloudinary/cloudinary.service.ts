import { BadRequestException, Injectable } from '@nestjs/common';
import { UploadApiErrorResponse, UploadApiResponse, v2 } from 'cloudinary';
import toStream = require('buffer-to-stream');
@Injectable()
export class CloudinaryService {
  async uploadImage(file: Express.Multer.File): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      const upload = v2.uploader.upload_stream((error, result) => {
        if (error) return reject(error);
        if (!result) return reject(new Error('Upload failed'));
        resolve(result);
      });

      toStream(file.buffer).pipe(upload);
    });
  }

  async uploadImageToCloudinary(file: Express.Multer.File) {
    return await this.uploadImage(file).catch(() => {
      throw new BadRequestException('Invalid file type.');
    });
  }
}
