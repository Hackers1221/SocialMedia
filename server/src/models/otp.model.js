const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const optSchema = new Schema({
    email : {
        type : String
    },
    otp : {
        type : String
    }
})

const otp = mongoose.model('otp',optSchema);

module.exports = otp;