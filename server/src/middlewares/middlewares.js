const ExpressError = require('../utils/express.error');
const {userSchema} = require('../validators/schema');
const User = require("../models/user.model");
const { deleteImages, uploadSingleImage } = require('../../cloudConfig');
const { StatusCodes } = require('http-status-codes');

const checkUser = (req,res,next) => {
    const result = userSchema.validate(req.body);
    if(result.error){
        const errMsg = result.error.details.map((el) => el.message).join(",");
        console.log(errMsg);
        throw new ExpressError(400,errMsg);
    }
    next();
}

const updateProfileImage = async (req, res, next) => {
    try{
        const userId = req.body.id;
        const user = await User.findById(userId);
       
        if(req.file) {
            if(user.image?.url) {
                await deleteImages([user.image.filename]);
            }
            const image = {};
            image.url = req.file.path;
            image.filename = req.file.filename;
            await User.findByIdAndUpdate(userId, {image});
        }
        next();
    }
    catch(error){
        return res.status(StatusCodes.BAD_REQUEST).send({
            msg : "Error in uploading image",
        })
    }
} 

module.exports = {
    checkUser,
    updateProfileImage,
}