const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/complaints/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'video/mp4' || file.mimetype === 'video/webm' || file.mimetype === 'video/quicktime') {
    cb(null, true);
  } else {
    cb(new Error('Only .mp4, .webm, and .mov video formats are allowed!'), false);
  }
};

const uploadVideo = multer({ 
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 50 
  },
  fileFilter: fileFilter
});

module.exports = uploadVideo;