const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
require('dotenv').config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 2. Set up the storage engine
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'portfolio_uploads', // The folder name in your Cloudinary dashboard
    resource_type: 'auto',       // Vital: Allows both Images AND Videos
    allowed_formats: ['jpg', 'png', 'jpeg', 'mp4', 'mov', 'webp'],
  },
});

module.exports = { cloudinary, storage };