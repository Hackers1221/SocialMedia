

const express = require('express');

const validators = require('../validators/authenticate.user');
const commentController = require('../controllers/comments.controller');

const commentRouter = express.Router();

commentRouter.post('/',validators.isUserAuthenticated,commentController.CreateComment);

module.exports = commentRouter