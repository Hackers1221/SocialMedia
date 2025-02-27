const express = require('express');
const authcontroller = require('../controllers/auth.controller')
const {checkUser} = require('../middlewares/middlewares')
const validators = require('../validators/authenticate.user')

const userroutes = express.Router();

userroutes.post('/signup',checkUser,authcontroller.signup);
userroutes.post('/signin',authcontroller.signin);
userroutes.get('/users/:id',validators.isUserAuthenticated,authcontroller.getuserByid);
userroutes.patch('/:id',validators.isUserAuthenticated,authcontroller.updateUser);
userroutes.patch('/follow/:id',validators.isUserAuthenticated,authcontroller.followUser);
userroutes.get('/users/:name',validators.isUserAuthenticated,authcontroller.getUserByUserName);

module.exports = userroutes