const express = require('express');
const postController = require('../controllers/posts.controller')
const postRoutes = express.Router();
const validators = require('../validators/authenticate.user')

// Requireing my storage
const {upload} = require("../../cloudConfig");

postRoutes.post('/posts', validators.isUserAuthenticated, upload, postController.createPost);
postRoutes.get('/posts',validators.isUserAuthenticated, postController.getallPosts);
postRoutes.patch('/posts/:id',validators.isUserAuthenticated,postController.updatePost)
postRoutes.patch('/like/:id',validators.isUserAuthenticated,postController.likePost);
postRoutes.get('/posts/:id',validators.isUserAuthenticated,postController.getPostByUserId);
postRoutes.patch('/save/:id',validators.isUserAuthenticated,postController.savePost);
postRoutes.get('/save/:id',validators.isUserAuthenticated,postController.getAllSavedPost);
postRoutes.delete('/:id',validators.isUserAuthenticated,postController.DeletePost);
postRoutes.get('/:id',validators.isUserAuthenticated,postController.getPostById);
postRoutes.get('/search/:q',validators.isUserAuthenticated,postController.searchPost);


module.exports = postRoutes
