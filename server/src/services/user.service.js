
const usermodel = require('../models/user.model')
const bcrypt = require('bcrypt')

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
        response.user = await usermodel.create(userObject)
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

const updateUser = async (userId, updatedData) => {
    const response = {};
    try {
        if (updatedData.password) {
            updatedData.password = await bcrypt.hash(updatedData.password, 11);
        }

        const updatedUser = await usermodel.findByIdAndUpdate(
            userId, 
            updatedData, 
            { new: true, runValidators: true } 
        );

        if (!updatedUser) {
            response.error = "User not found";
            return response;
        }
        
        response.user = updatedUser;
        return response;
    } catch (error) {
        response.error = error.message;
        return response;
    }
};

module.exports = {
    CreateUser,
    ValidateUser,
    getuserByid,
    updateUser
}

