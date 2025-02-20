const express = require('express');
const authcontroller = require('../controllers/auth.controller')

const userroutes = express.Router();

userroutes.post('/signup',authcontroller.signup);
userroutes.get('/signin',authcontroller.signin);

module.exports = userroutes