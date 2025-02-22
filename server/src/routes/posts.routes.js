const express = require('express');
const postController = require('../controllers/posts.controller')
const postRoutes = express.Router();
const validators = require('../validators/authenticate.user')

// Requireing my storage
const upload = require("../../cloudConfig");

postRoutes.post('/posts', validators.isUserAuthenticated, upload, postController.createPost);
postRoutes.get('/posts',validators.isUserAuthenticated, postController.getallPosts);
postRoutes.patch('/posts/:id',validators.isUserAuthenticated,postController.updatePost)

module.exports = postRoutes
