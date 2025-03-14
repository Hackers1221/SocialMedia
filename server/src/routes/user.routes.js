const express = require('express');
const authcontroller = require('../controllers/auth.controller')
const otpcontroller = require("../controllers/sentOtp.controller.js");
const {checkUser, updateProfileImage} = require('../middlewares/middlewares')
const {uploadSingleImage} = require("../../cloudConfig.js")
const validators = require('../validators/authenticate.user')

const userroutes = express.Router();

userroutes.post('/sendotp',otpcontroller.sendOtp);
userroutes.post('/forgetpass',otpcontroller.forgetPasswordLink);
userroutes.post('/resetpass/:token',otpcontroller.resetPassword);
userroutes.post('/verifyotp',otpcontroller.verifyotp);
userroutes.post('/signup',checkUser,authcontroller.signup);
userroutes.post('/signin',authcontroller.signin);
userroutes.get('/users/:id',validators.isUserAuthenticated,authcontroller.getuserByid);
userroutes.patch('/',validators.isUserAuthenticated, uploadSingleImage, updateProfileImage, authcontroller.updateUser);
userroutes.patch('/follow/:id',validators.isUserAuthenticated,authcontroller.followUser);
userroutes.get('/user/:name',validators.isUserAuthenticated,authcontroller.getUserByUserName);

module.exports = userroutes