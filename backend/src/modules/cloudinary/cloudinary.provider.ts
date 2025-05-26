import { ConfigOptions, v2 } from 'cloudinary';
import { CLOUDINARY } from 'src/common/constants/constants';
require('dotenv').config();


export const CloudinaryProvider = {
  provide: CLOUDINARY,
  useFactory: (): ConfigOptions => {
    return v2.config({
        cloud_name: process.env.CLOUD_NAME,
        api_key: process.env.API_KEY,
      api_secret: process.env. API_SECRET,
    });
  },
};