const express = require('express');
const authcontroller = require('../controllers/auth.controller')

const userroutes = express.Router();

userroutes.post('/signup',authcontroller.signup);

module.exports = userroutes