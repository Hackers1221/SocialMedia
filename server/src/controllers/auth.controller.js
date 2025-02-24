const userService = require('../services/user.service');
const {StatusCodes} = require('http-status-codes');
const jwt = require('jsonwebtoken')

const signup = async(req,res) =>  {
        const response  = await userService.CreateUser(req.body);

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

const updateUser = async(req,res) => {
    const response = await userService.updateUser(req.params.id,req.body);
    if(response.error){
        return res.status(StatusCodes.BAD_REQUEST).send({
            msg : "Unable to update the user",
            error : response.error
        })
    }
    return res.status(StatusCodes.OK).send({
        msg : "Successfully updated the user",
        userDetails : response.user
    })
}

const followUser = async(req,res) => {
    const response = await userService.followUser(req.params.id,req.body.id);
    if(response.error){
        return res.status(StatusCodes.BAD_REQUEST).send({
            msg : "Unable to follow the user",
            error : response.error
        })
    }
    return res.status(StatusCodes.OK).send({
        msg : "Successfully followed the user",
        userDetails : response.user
    })
}

const getUserByUserName = async(req,res) => {
    const response = await userService.getUserByUserName((req.params.name));
    if(response.error){
        return res.status(StatusCodes.BAD_REQUEST).send({
            msg : "Unable to Fetch the user",
            error : response.error
        })
    }
    return res.status(StatusCodes.OK).send({
        msg : "Successfully fetched the userdetails",
        userDetails : response.user
    })
}

module.exports = {
    signup,
    signin,
    getuserByid,
    updateUser,
    followUser,
    getUserByUserName
}