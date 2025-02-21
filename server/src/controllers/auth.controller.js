const userService = require('../services/user.service');
const {StatusCodes} = require('http-status-codes');
const jwt = require('jsonwebtoken')

const signup = async(req,res) =>  {
    console.log (req.body);
        const response  = await userService.CreateUser(req.body);
        console.log(response)
        if(response.error){
            return res.status(StatusCodes.BAD_REQUEST).send({
                msg : "Signup failed",
                error : response.error
            })
        }
        return res.status(StatusCodes.CREATED).send({
            msg : "Successfully created the account",
            userdata: response
        })
};

const signin = async(req,res) => {
    const response = await userService.ValidateUser(req.body);
    if(response.error){
        return res.status(StatusCodes.BAD_REQUEST).send({
            msg:"Login failed",
            error : response.error
        })
    }
    const token  = jwt.sign({email : req.body.email} , process.env.secret_key)
    return res.status(StatusCodes.ACCEPTED).json({
        msg : "Successfully Login",
        userdata : response.userdata,
        token : token
    })
}

const getuserByid = async(req,res) => {
    const response = await userService.getuserByid(req.params.id);
    if(response.error){
        return res.status(StatusCodes.BAD_REQUEST).send({
            msg:"User not found",
            error : response.error
        })
    }
    return res.status(StatusCodes.ACCEPTED).json({
        msg : "User details fetched",
        userdetails : response.user
    })
}

module.exports = {
    signup,
    signin,
    getuserByid
}