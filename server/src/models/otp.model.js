const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const optSchema = new Schema({
    email : {
        type : String
    },
    otp : {
        type : String
    },
    isVerified : {
        type : Boolean , 
        default : false
    }
})

const otp = mongoose.model('otp',optSchema);

module.exports = otp;