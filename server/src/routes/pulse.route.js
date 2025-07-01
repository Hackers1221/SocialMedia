const express = require('express');
const pulseController = require('../controllers/pulse.controller')
const pulseRoutes = express.Router();
const validators = require('../validators/authenticate.user')

// Requireing my storage
const {uploadSingleVideo} = require("../../cloudConfig");

pulseRoutes.post('/', validators.isUserAuthenticated, uploadSingleVideo, pulseController.createPulse);
pulseRoutes.get('/',validators.isUserAuthenticated, pulseController.getAllPulse);
pulseRoutes.patch('/like/:id',validators.isUserAuthenticated,pulseController.likePulse);
pulseRoutes.get('/:id',validators.isUserAuthenticated, pulseController.getPulseByUserId);
pulseRoutes.get('/save/:id',validators.isUserAuthenticated, pulseController.getAllSavedPulse);
pulseRoutes.delete('/:id',validators.isUserAuthenticated, pulseController.DeletePulse);
pulseRoutes.patch('/save/:id',validators.isUserAuthenticated, pulseController.savePulse);
pulseRoutes.get('/:id',validators.isUserAuthenticated, pulseController.getPulseById);
pulseRoutes.get('/search/:q',validators.isUserAuthenticated, pulseController.searchPulse);
pulseRoutes.get('/pulse/:id',validators.isUserAuthenticated, pulseController.getPulseByUserId);
pulseRoutes.delete('/:id',validators.isUserAuthenticated,pulseController.DeletePulse);


module.exports = pulseRoutes;
