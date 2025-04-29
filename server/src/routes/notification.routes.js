const express = require('express');
const validators = require('../validators/authenticate.user');
const notificationController = require('../controllers/notification.controller')
const notificationRouter = express.Router();

notificationRouter.delete('/follow',validators.isUserAuthenticated,notificationController.rejectFR);
notificationRouter.post('/follow',validators.isUserAuthenticated,notificationController.acceptFR);
notificationRouter.delete('/non-follow/:userId',validators.isUserAuthenticated,notificationController.deleteNonFR);

module.exports = notificationRouter