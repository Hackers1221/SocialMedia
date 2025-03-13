
const usermodel = require('../models/user.model')
const bcrypt = require('bcrypt');
const mailer = require('../middlewares/mailer')

const CreateUser = async(data) => { 
    const response  = {};

    try {
        const userObject = {
            name :  data.name,
            username : data.username,
            email : data.email , 
            password  : data.password,
            birth : data.birth
        }
        response.user = await usermodel.create(userObject);
        await mailer.sendWelcomeEmail(data.email); 
        return response;
    } catch (error) {
        console.log("Error" , error);
        response.error = error.message;
        return response ; 
    }
};

const ValidateUser = async(data) => {
    const response = {};
    try {
        const res = await usermodel.findOne({email : data.email});
        if(!res){
            response.error = "Invalid email";
            return response;
        }
        const result = bcrypt.compareSync(data.password, res.password);
        if(!result){
            response.error = "Invalid password";
            return response
        }
        response.userdata = res; 
        return response;
    } catch (error) {
        console.log("Error" , error);
        response.error = error.message;
        return response ; 
    }
}

const getuserByid = async(id) => {
    const response = {};
    try {
        const userdetails = await usermodel.findById(id);
        if(!userdetails){
            response.error = "User not found";
        }else{
            response.user = userdetails;
        }
        return response;

    } catch (error) {
        console.log("Error" , error);
        response.error = error.message;
        return response ; 
    }
}

const followUser = async(userId , followingId) => {
    const response = {};
    try {
        const userData = await usermodel.findById(userId);
        if(!userData){
            response.error = error.message;
            return response;
        }
        if(userData.following.includes(followingId)){
            userData.following = userData.following.filter ((ids) => ids!=followingId);
        }else{
            userData.following.push(followingId);
        }
        const followingData = await usermodel.findById(followingId);
        if(!followingId){
            response.error = error.message;
            return response;
        }
        if(followingData.follower.includes(userId)){
            followingData.follower = followingData.follower.filter((ids) => ids!=userId);
        }else{
            followingData.follower.push(userId);
        }
        const updatedUser = await usermodel.findByIdAndUpdate(
            userId, 
            {following : userData.following},
            { new: true, runValidators: true } 
        );
        const updatefollower= await usermodel.findByIdAndUpdate(
            followingId, 
            {follower : followingData.follower},
            { new: true, runValidators: true } 
        );
        response.user = updatedUser;
        return response;
    } catch (error) {
        response.error = error.message;
        return response;
    }
}

const getUserByUserName = async(name) => {
    const response = {};
    try {
        const userData = await usermodel.findOne({username : name});
        if(!userData){
            response.error = "User not found";
            return response;
        }
        console.log(userData);
        response.user = userData;
        return response;
    } catch (error) {
        response.error = error.message;
        return response;
    }
}
const updateUser = async(newData) => {
    const response = {};
    try {
        const userData = await usermodel.findById(newData.id);
        if (!userData) {
            response.error = "User not found";
            return response;
        }
        if(newData.curpassword){
            const result = bcrypt.compareSync(newData.curpassword, userData.password);
            if(!result){
                response.error = "Current password does not match";
                return response;
            }
            newData.password = await bcrypt.hash(newData.password, 11);
        }
        else {
            newData.password = userData.password;
        }

        const val = newData.id;
        delete newData.id;
        delete newData.curpassword;
        const updateuser = await usermodel.findByIdAndUpdate(
            val , 
            newData,
            {new : true}
        )
        response.user = updateuser;
        return response;
    } catch (error) {
        response.error = error.message;
        return response
    }
}
module.exports = {
    CreateUser,
    ValidateUser,
    getuserByid,
    updateUser,
    followUser,
    getUserByUserName
}

