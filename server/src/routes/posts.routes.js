const express = require('express');
const postController = require('../controllers/posts.controller')
const postRoutes = express.Router();
const validators = require('../validators/authenticate.user')

postRoutes.post('/posts',validators.isUserAuthenticated,postController.createPost);
postRoutes.get('/posts',validators.isUserAuthenticated,postController.getallPosts);

module.exports = postRoutes