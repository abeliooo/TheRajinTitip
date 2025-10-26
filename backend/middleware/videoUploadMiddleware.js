const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const videoStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'the-rajin-titip/complaints',
    resource_type: 'video', 
    allowed_formats: ['mp4', 'webm', 'mov'],
  },
});

const uploadVideo = multer({ 
  storage: videoStorage,
  limits: {
    fileSize: 1024 * 1024 * 50 
  },
});

module.exports = uploadVideo;