const express = require('express');
const authcontroller = require('../controllers/auth.controller')
const {checkUser} = require('../middlewares/middlewares')
const validators = require('../validators/authenticate.user')

const userroutes = express.Router();

userroutes.post('/signup',checkUser,authcontroller.signup);
userroutes.post('/signin',authcontroller.signin);
userroutes.get('/user/:id',validators.isUserAuthenticated,authcontroller.getuserByid);

module.exports = userroutes