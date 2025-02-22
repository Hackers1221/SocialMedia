const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
const dotenv = require('dotenv');
dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    try {
      if (!file || !file.mimetype) {
        throw new Error('Invalid file uploaded');
      }

      const isImage = file.mimetype.startsWith('image');
      const folder = isImage ? 'socialMedia/images' : 'socialMedia/videos';
      const resource_type = isImage ? 'image' : 'video';

      // Normalize format (e.g., "jpeg" → "jpg")
      let format = file.mimetype.split('/')[1];
      if (format === 'jpeg') format = 'jpg';

      return {
        folder,
        resource_type,
        format,
        public_id: `${Date.now()}-${file.originalname}`, // Ensures unique filename
        transformation: [{ format }], // Correct way to apply format
      };
    } catch (error) {
      console.error('Error in Cloudinary params:', error);
      throw error; // Ensures error is caught by multer
    }
  },
});

const upload = multer({ 
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // Limit file size (e.g., 50MB)
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image') && !file.mimetype.startsWith('video')) {
      return cb(new Error('Only image and video files are allowed!'), false);
    }
    cb(null, true);
  },
}).fields([
  { name: 'image', maxCount: 10 },
  { name: 'video', maxCount: 5 },
]);

module.exports = upload;





