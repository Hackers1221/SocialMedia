const express = require('express');
const validators = require('../validators/authenticate.user');
const groupController = require('../controllers/group.controller')
const groupRouter = express.Router();

groupRouter.post ('/',validators.isUserAuthenticated,groupController.createGroup)

module.exports = groupRouter