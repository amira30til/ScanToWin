const cloudinary = require('cloudinary').v2;
const { Readable } = require('stream');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const bufferToStream = (buffer) => {
  const readable = new Readable();
  readable._read = () => {};
  readable.push(buffer);
  readable.push(null);
  return readable;
};

class CloudinaryService {
  async uploadImage(file) {
    return new Promise((resolve, reject) => {
      const upload = cloudinary.uploader.upload_stream(
        (error, result) => {
          if (error) return reject(error);
          if (!result) return reject(new Error('Upload failed'));
          resolve(result);
        }
      );

      bufferToStream(file.buffer).pipe(upload);
    });
  }

  async uploadImageToCloudinary(file) {
    try {
      return await this.uploadImage(file);
    } catch (error) {
      throw new Error('Invalid file type.');
    }
  }
}

module.exports = new CloudinaryService();
