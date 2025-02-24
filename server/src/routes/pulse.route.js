const express = require('express');
const pulseController = require('../controllers/pulse.controller')
const pulseRoutes = express.Router();
const validators = require('../validators/authenticate.user')

// Requireing my storage
const upload = require("../../cloudConfig");

pulseRoutes.post('/', validators.isUserAuthenticated, upload, pulseController.createPulse);
pulseRoutes.get('/',validators.isUserAuthenticated, pulseController.getAllPulse);

module.exports = pulseRoutes
