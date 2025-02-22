// const cloudinary = require('cloudinary').v2;
// const { CloudinaryStorage } = require('multer-storage-cloudinary');

// cloudinary.config({
//     cloud_name: process.env.CLOUD_NAME,
//     api_key: process.env.CLOUD_API_KEY,
//     api_secret: process.env.CLOUD_API_SECRET,
// });

// const storage = new CloudinaryStorage({
//     cloudinary: cloudinary,
//     params: {
//       folder: 'SocialMedia',
//       resource_type: 'auto',
//       allowedFormats: ["png", "jpg", "jpeg", "webp", "mp4", "avi", "mov", "mkv"],
//     },
//   });

// module.exports = {cloudinary, storage};

const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
});

// Allowed formats for images and videos only
const allowedFormats = ["png", "jpg", "jpeg", "webp", "mp4", "avi", "mov", "mkv"];

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
        const fileFormat = file.mimetype.split('/')[1]; // Extract file extension from MIME type

        // Validate format
        if (!allowedFormats.includes(fileFormat)) {
            throw new Error("Invalid file format. Only images and videos are allowed.");
        }

        return {
            folder: 'SocialMedia',  // Fixed typo from 'SocialMeadia'
            format: fileFormat,  
            resource_type: "auto",  // Let Cloudinary determine the file type
        };
    }
});

// File filter to ensure only images & videos are uploaded
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image/") || file.mimetype.startsWith("video/")) {
        cb(null, true);
    } else {
        cb(new Error("Only images and videos are allowed"), false);
    }
};

module.exports = { cloudinary, storage, fileFilter };
