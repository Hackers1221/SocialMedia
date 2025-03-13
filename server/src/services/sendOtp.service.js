

const sendOtpmiddleware = require('../middlewares/mailer.js');
const crypto = require('crypto');
const otpModel = require('../models/otp.model.js');
const usermodel = require('../models/user.model.js')
const bcrypt = require("bcrypt");



const sendotp = async(email) => {
    const response = {};
    try {
        const userdata = await usermodel.findOne({
            email
        })
        if(userdata){
            response.error = "Email already in Use";
            return response;
        }
        const otps = await otpModel.deleteMany({
            email : email
        })
        const otp = crypto.randomInt(100000, 999999).toString();
        const sent = await sendOtpmiddleware.sendOtp(email,otp);
        if(!sent){
            response.error = sent;
            msg = "Otp not sent";
            return response;
        }
        const user = await otpModel.create({
            email,otp
        });
        response.user = user;
        return response;
    } catch (error) {
        response.error = error.message;
        return response;
    }
}

const verifyotp = async(email,otp) => {
    const response = {};
    try {
        const userdata = await otpModel.findOne({
            email
        });
        if(!email){
            response.error = "email not found";
            return response;
        }
        if(userdata.otp!=otp){
            response.error = "Otp not same";
            return response;
        }
        await otpModel.deleteMany({
            email
        })
        response.user = userdata;
        return response
    } catch (error) {
        response.error = error.message;
        return response
    }
}

const forgetPasswordLink = async(email) => {
    const response = {};
    try {
        const userdata = await usermodel.findOne({
            email 
        });
        if(!userdata){
            response.error = "email not found";
            return response;
        }
        const sent = await sendOtpmiddleware.forgetPasswordLink(email);
        if(!sent){
            response.error = sent;
            msg = "Reset password link not sent";
            return response;
        }
        response.user = userdata;
        return response;
    } catch (error) {
        response.error = error.message;
        return response
    }
}

const resetPassword = async (email, newPassword) => {
    const response = {};
    try {
        const hashedPassword = await bcrypt.hash(newPassword, 11);
        const updatedUser = await usermodel.findOneAndUpdate(
            { email }, 
            { password: hashedPassword }, 
            { new: true }
        );
        if (!updatedUser) {
            response.error = "Unable to reset the password";
            return response;
        }
        const sent = sendOtpmiddleware.passwordChangedEmail(email);
        if(!sent){
            response.error = sent;
            msg = "Reset password link not sent";
            return response;
        }
        response.user = updatedUser;
        return response;
    } catch (error) {
        response.error = error.message;
        return response;
    }
};

module.exports = { resetPassword };

module.exports = {
    sendotp,
    verifyotp,
    forgetPasswordLink,
    resetPassword
}