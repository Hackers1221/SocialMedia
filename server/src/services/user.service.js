
const usermodel = require('../models/user.model')
const bcrypt = require('bcrypt')

const CreateUser = async(data) => { 
    const response  = {};
    console.log(data);
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

module.exports = {
    CreateUser,
    ValidateUser
}

