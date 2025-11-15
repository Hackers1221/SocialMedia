const express = require('express');
const announcementController = require ('../controllers/announcement.controller')
const announcementRoutes = express.Router ();
const validators = require('../validators/authenticate.user')

announcementRoutes.post('/announcement', validators.isUserAuthenticated, announcementController.createAnnouncement);
announcementRoutes.get('/announcement/:userId',validators.isUserAuthenticated, announcementController.getAllAnnouncement);
announcementRoutes.patch('/congratulate/:id',validators.isUserAuthenticated,announcementController.congratulate);
announcementRoutes.patch('/sorrify/:id',validators.isUserAuthenticated,announcementController.sorrify);
announcementRoutes.delete('/:id',validators.isUserAuthenticated,announcementController.deleteAnnouncement);


module.exports = announcementRoutes
