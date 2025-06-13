const express = require('express');
const announcementController = require ('../controllers/announcement.controller')
const announcementRoutes = express.Router ();
const validators = require('../validators/authenticate.user')

announcementRoutes.post('/announcement', validators.isUserAuthenticated, announcementController.createAnnouncement);
announcementRoutes.get('/announcement/:userId',validators.isUserAuthenticated, announcementController.getAllAnnouncement);
// verseRoutes.patch('/verse/:id',validators.isUserAuthenticated,verseController.updateVerse)
// verseRoutes.patch('/like/:id',validators.isUserAuthenticated,verseController.likeVerse);
// verseRoutes.get('/verse/:id',validators.isUserAuthenticated,verseController.getVerseByUserId);
// verseRoutes.patch('/save/:id',validators.isUserAuthenticated,verseController.savePost);
// verseRoutes.get('/save/:id',validators.isUserAuthenticated,verseController.getAllSavedPost);
announcementRoutes.delete('/:id',validators.isUserAuthenticated,announcementController.deleteAnnouncement);
// verseRoutes.get('/:id',validators.isUserAuthenticated,verseController.getVerseById)


module.exports = announcementRoutes
