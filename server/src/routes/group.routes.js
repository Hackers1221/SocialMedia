const express = require('express');
const validators = require('../validators/authenticate.user');
const groupController = require('../controllers/group.controller')
const groupRouter = express.Router();

const {uploadSingleImage} = require("../../cloudConfig.js")

groupRouter.post('/',validators.isUserAuthenticated, uploadSingleImage, groupController.createGroup);
groupRouter.get('/by-id/:id', validators.isUserAuthenticated, groupController.getGroupById);
groupRouter.get('/by-user/:userId', validators.isUserAuthenticated, groupController.getGroupByUserId);
groupRouter.get('/recent/:userId', validators.isUserAuthenticated, groupController.getRecentMessage);

module.exports = groupRouter