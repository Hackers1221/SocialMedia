const express = require('express');
const validators = require('../validators/authenticate.user');
const messageController = require('../controllers/message.controller')
const messageRouter = express.Router();

// Requireing my storage
const {uploadFiles} = require("../../cloudConfig");

messageRouter.get('/', validators.isUserAuthenticated, uploadFiles, messageController.getMessage);

module.exports = messageRouter