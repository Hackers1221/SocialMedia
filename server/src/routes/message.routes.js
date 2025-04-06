const express = require('express');
const validators = require('../validators/authenticate.user');
const messageController = require('../controllers/message.controller')
const messageRouter = express.Router();

messageRouter.get('/',validators.isUserAuthenticated,messageController.getMessage);
messageRouter.get('/:id',validators.isUserAuthenticated,messageController.getRecentMessage);

module.exports = messageRouter