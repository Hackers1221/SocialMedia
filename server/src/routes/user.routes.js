const express = require('express');
const authcontroller = require('../controllers/auth.controller')
const otpcontroller = require("../controllers/sentOtp.controller.js");
const {checkUser, updateProfileImage} = require('../middlewares/middlewares')
const {uploadSingleImage} = require("../../cloudConfig.js")
const validators = require('../validators/authenticate.user')

const userRoutes = express.Router();

userRoutes.post('/sendotp',otpcontroller.sendOtp);
userRoutes.post('/forgetpass',otpcontroller.forgetPasswordLink);
userRoutes.post('/resetpass/:token',otpcontroller.resetPassword);
userRoutes.post('/verifyotp',otpcontroller.verifyotp);
userRoutes.post('/signup',checkUser,authcontroller.signup);
userRoutes.post('/signin',authcontroller.signin);
userRoutes.get('/users/:id',validators.isUserAuthenticated,authcontroller.getuserByid);
userRoutes.patch('/',validators.isUserAuthenticated, uploadSingleImage, updateProfileImage, authcontroller.updateUser);
userRoutes.patch('/follow/:id',validators.isUserAuthenticated,authcontroller.followUser);
userRoutes.get('/user/:name',validators.isUserAuthenticated,authcontroller.getUserByUserName);
userRoutes.delete('/:id',validators.isUserAuthenticated, authcontroller.deleteUser);
userRoutes.get('/search/:q',validators.isUserAuthenticated,authcontroller.searchUser);
userRoutes.get('/usersByLimit', validators.isUserAuthenticated, authcontroller.getUserByLimit);

module.exports = userRoutes