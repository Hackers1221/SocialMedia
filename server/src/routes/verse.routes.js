const express = require('express');
const verseController = require ('../controllers/verse.controller')
const verseRoutes = express.Router ();
const validators = require('../validators/authenticate.user')

verseRoutes.post('/verse', validators.isUserAuthenticated, verseController.createVerse);
verseRoutes.get('/verse',validators.isUserAuthenticated, verseController.getAllVerse);
verseRoutes.patch('/verse/:id',validators.isUserAuthenticated,verseController.updateVerse)
verseRoutes.patch('/like/:id',validators.isUserAuthenticated,verseController.likeVerse);
verseRoutes.get('/verse/:id',validators.isUserAuthenticated,verseController.getVerseByUserId);
// verseRoutes.patch('/save/:id',validators.isUserAuthenticated,verseController.savePost);
// verseRoutes.get('/save/:id',validators.isUserAuthenticated,verseController.getAllSavedPost);
verseRoutes.delete('/:id',validators.isUserAuthenticated,verseController.deleteVerse);
verseRoutes.get('/:id',validators.isUserAuthenticated,verseController.getVerseById)


module.exports = verseRoutes
