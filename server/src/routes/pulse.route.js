const express = require('express');
const pulseController = require('../controllers/pulse.controller')
const pulseRoutes = express.Router();
const validators = require('../validators/authenticate.user')

// Requireing my storage
const {uploadSingleVideo} = require("../../cloudConfig");

pulseRoutes.post('/', validators.isUserAuthenticated, uploadSingleVideo, pulseController.createPulse);
pulseRoutes.get('/',validators.isUserAuthenticated, pulseController.getAllPulse);
pulseRoutes.patch('/like/:id',validators.isUserAuthenticated,pulseController.likePulse);

module.exports = pulseRoutes
