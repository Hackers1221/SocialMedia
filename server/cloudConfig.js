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


// Upload multiple image and videos
const upload = multer({ 
  storage,
  limits: { fileSize: 20 * 1024 * 1024 }, // Limit file size (e.g., 20MB)
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

// upload single image
const uploadSingleImage = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size (e.g., 5MB)
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image')) {
      return cb(new Error('Only image file is allowed!'), false);
    }
    cb(null, true);
  },
}).single("image");


//upload single video
const uploadSingleVideo = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // Limit file size (e.g., 10MB)
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('video')) {
      return cb(new Error('Only video file is allowed!'), false);
    }
    cb(null, true);
  },
}).single("video");



// Delete multiple images from Cloudinary
const deleteImages = async (publicIds) => {
  try {
    if (!Array.isArray(publicIds)) {
      throw new Error('Invalid publicIds array');
    }
    await Promise.all(
      publicIds.map(id => cloudinary.uploader.destroy(id, { resource_type: "image" }))
    );

    return { success: true, message: 'Images deleted successfully' };
  } catch (error) {
    console.error('Cloudinary Delete Error:', error);
    return { success: false, message: 'Failed to delete Images' };
  }
};

// Delete multiple videos from Cloudinary
const deleteVideos = async (publicIds) => {
  try {
    if (!Array.isArray(publicIds)) {
      throw new Error('Invalid publicIds array');
    }
    await Promise.all(
      publicIds.map(id => cloudinary.uploader.destroy(id, { resource_type: "video" }))
    );

    return { success: true, message: 'Videos deleted successfully' };
  } catch (error) {
    console.error('Cloudinary Delete Error:', error);
    return { success: false, message: 'Videos to delete files' };
  }
};

// Update profile image
const updateImage = async (oldPublicId) => {
  try {
    await deleteImages([oldPublicId]);
    const uploadResponse = await cloudinary.uploader.upload(file.path, {
      folder: 'socialMedia/images',
      resource_type: 'image'
    });
    return { success: true, url: uploadResponse.secure_url, public_id: uploadResponse.public_id };
  } catch (error) {
    console.error('Cloudinary Update Error:', error);
    return { success: false, message: 'Failed to update image' };
  }
};


module.exports = {upload, uploadSingleImage, uploadSingleVideo, updateImage, deleteImages, deleteVideos};





