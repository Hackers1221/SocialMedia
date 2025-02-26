

const express = require('express');

const validators = require('../validators/authenticate.user');
const commentController = require('../controllers/comments.controller');

const commentRouter = express.Router();

commentRouter.post('/',validators.isUserAuthenticated,commentController.CreateComment);
commentRouter.get('/:id',validators.isUserAuthenticated,commentController.getCommentByPostId);

module.exports = commentRouter