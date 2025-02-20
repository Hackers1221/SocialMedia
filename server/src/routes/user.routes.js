const express = require('express');
const authcontroller = require('../controllers/auth.controller')
const {checkUser} = require('../middlewares/middlewares')

const userroutes = express.Router();

userroutes.post('/signup',checkUser,authcontroller.signup);
userroutes.post('/signin',authcontroller.signin);

module.exports = userroutes