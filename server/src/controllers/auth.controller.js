const userService = require('../services/user.service');
const {StatusCodes} = require('http-status-codes');
const jwt = require('jsonwebtoken')
const authservice = require('../services/auth.service')

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
    const response = await userService.ValidateUser(req.body.email,req.body.password);
    if(response.error){
        return res.status(StatusCodes.BAD_REQUEST).send({
            msg:"Login failed",
            error : response.error
        })
    }

    const token = jwt.sign({email : req.body.email} , process.env.secret_key);; 

    return res.status(StatusCodes.ACCEPTED).json({
        msg : "Successfully Login",
        userdata : response.userdata,
        token : token,
        notifications: response.notifications,
    })
}



const deleteUser = async(req, res) => {
    const { id } = req.params;

    // Extract token from headers and decode it
    const token = req.headers['x-access-token']
    const decoded = await authservice.verfiyJwtToken(token);

    const UserResponse = await userService.getuserByid(id);
    if(UserResponse.error){
        return res.status(StatusCodes.BAD_REQUEST).send({
            msg:"This account does not exist! Try after relogin",
            error : UserResponse.error
        })
    }
    const user = UserResponse.user;

    if (!user || (user.email !== decoded.email && user.username !== decoded.email)) {
        return res.status(StatusCodes.FORBIDDEN).send({ msg: "Forbidden: You can only delete your own account" });
    }

    const response = await userService.deleteUser(id);
    if(response.error){
        return res.status(StatusCodes.BAD_REQUEST).send({
            msg:"Delete Unsuccessful due to some error!",
            error : response.error
        })
    }
    return res.status(StatusCodes.ACCEPTED).json({
        msg : response.message,
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
    const response = await userService.updateUser(req.body);
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

const followRequest = async(req, res) => {
    const response = await userService.followRequest(req.params.id, req.body.id);
    if(response.error){
        return res.status(StatusCodes.BAD_REQUEST).send({
            msg : "Unable to request the user",
            error : response.error
        })
    }
    return res.status(StatusCodes.OK).send({
        msg : "Successfully requested to  user",
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

const searchUser = async(req,res) => {
    const response = await userService.searchUser(String(req.params.q));
    if(response.error){
        return res.status(StatusCodes.BAD_REQUEST).send({
            msg:"Unable to fetch the searched user",
            error : response.error
        })
    }
    return res.status(StatusCodes.ACCEPTED).json({
        msg : "Successfully fetched the searched users",
        userdata : response.user,
    })
}

const getUserByLimit = async(req, res) => {
    const response = await userService.getUserByLimit(req.query.userId, req.query.limit);
    if(response.error){
        return res.status(StatusCodes.BAD_REQUEST).send({
            msg : "Unable to Fetch users",
            error : response.error
        })
    }
    return res.status(StatusCodes.OK).send({
        msg : "Successfully fetched users",
        users : response.user
    })
}


module.exports = {
    signup,
    signin,
    getuserByid,
    updateUser,
    followUser,
    getUserByUserName,
    deleteUser,
    searchUser,
    getUserByLimit,
    followRequest
}