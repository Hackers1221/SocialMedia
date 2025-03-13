

const sendOtpmiddleware = require('../middlewares/mailer.js');
const crypto = require('crypto');
const otpModel = require('../models/otp.model.js');
const usermodel = require('../models/user.model.js')



const sendotp = async(email) => {
    const response = {};
    try {
        const userdata = await usermodel.findOne({
            email
        })
        console.log(userdata);
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
module.exports = {
    sendotp,
    verifyotp
}