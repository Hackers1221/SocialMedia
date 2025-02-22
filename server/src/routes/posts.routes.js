const express = require('express');
const postController = require('../controllers/posts.controller')
const postRoutes = express.Router();
const validators = require('../validators/authenticate.user')

// Requiring multer 
const multer = require("multer");
const {cloudinary, storage} = require("../../cloudConfig.js");

const upload = multer({storage});

postRoutes.post('/posts',validators.isUserAuthenticated, upload.fields([
    { name: "image", maxCount: 5 },
    { name: "video", maxCount: 2 },
  ]), postController.createPost);
postRoutes.get('/posts',validators.isUserAuthenticated, postController.getallPosts);
postRoutes.patch('/posts/:id',validators.isUserAuthenticated,postController.updatePost)

module.exports = postRoutes
