
const usermodel = require('../models/user.model')

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

module.exports = {
    CreateUser
}

