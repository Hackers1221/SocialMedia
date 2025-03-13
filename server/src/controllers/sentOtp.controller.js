const otpService = require('../services/sendOtp.service')
const {StatusCodes} = require('http-status-codes')

const sendOtp = async(req,res) => {
    const response = await otpService.sendotp(req.body.email);
    if(response.error){
            return res.status(StatusCodes.BAD_REQUEST).send({
                msg : "Otp not sent",
                error : response.error
            })
        }
    return res.status(StatusCodes.CREATED).send({
        msg : "Otp sent succesfully",
        user: response.user
    })
}

const verifyotp = async(req,res) => {
    const response = await otpService.verifyotp(req.body.email,req.body.otp);
    if(response.error){
        return res.status(StatusCodes.BAD_REQUEST).send({
            msg : "Otp not verified",
            error : response.error
        })
    }
    return res.status(StatusCodes.CREATED).send({
        msg : "Otp verified succesfully",
        user: response.user
    })
}

const forgetPasswordLink = async(req,res) => {
    const response = await otpService.forgetPasswordLink(req.body.email);
    if(response.error){
        return res.status(StatusCodes.BAD_REQUEST).send({
            msg : "Unable to send reset password link",
            error : response.error
        })
    }
    return res.status(StatusCodes.CREATED).send({
        msg : "Successfully sent the verification link",
        user: response.user
    })
}

const resetPassword = async(req,res) => {
    const response = await otpService.resetPassword(req.body.email,req.body.password);
    if(response.error){
        return res.status(StatusCodes.BAD_REQUEST).send({
            msg : "Unable to reset the password",
            error : response.error
        })
    }
    return res.status(StatusCodes.CREATED).send({
        msg : "Successfully reset the password",
        user: response.user
    })
}

module.exports = {
    sendOtp,
    verifyotp,
    forgetPasswordLink,
    resetPassword
}