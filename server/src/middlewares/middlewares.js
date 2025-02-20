const ExpressError = require('../utils/Express.error');
const {userSchema} = require('../validators/schema');

const checkUser = (req,res,next) => {
    const result = userSchema.validate(req.body);
    if(result.error){
        const errMsg = result.error.details.map((el) => el.message).join(",");
        console.log(errMsg);
        throw new ExpressError(400,errMsg);
    }
    next();
}

module.exports = {
    checkUser
}