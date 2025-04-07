const express = require('express');
const validators = require('../validators/authenticate.user');
const groupController = require('../controllers/group.controller')
const groupRouter = express.Router();

groupRouter.post('/',validators.isUserAuthenticated,groupController.createGroup);
groupRouter.get('/by-id/:id', validators.isUserAuthenticated, groupController.getGroupById);
groupRouter.get('/by-user/:userId', validators.isUserAuthenticated, groupController.getGroupByUserId);


module.exports = groupRouter