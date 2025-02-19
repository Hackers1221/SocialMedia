const userService = require('../services/user.service');
const {StatusCodes} = require('http-status-codes')

const signup = async(req,res) =>  {
        const response  = await userService.CreateUser(req.body);
        console.log(response)
        if(response.error){
            return res.status(StatusCodes.BAD_REQUEST).json({
                msg : "Signup failed"
            })
        }
        return res.status(StatusCodes.CREATED).json({
            msg : "Successfully created the account",
            userdata: response
        })
};

module.exports = {
    signup
}