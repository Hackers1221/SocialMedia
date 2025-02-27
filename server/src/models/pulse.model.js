const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const pulseSchema = new Schema({
    video:{
        type: String,
        default: []
    },
    likes: {
        type: [String],
        default: []
    },
    filename: {
        type: String, 
        required: true 
    },
    caption: {
        type: String,
        default: ""
    },
    comments: {
        type: [String],
        default : []
    },
    interests : {
        type : String,
    },
    userId : {
        type : String,
        required : true
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
});

const Pulse = mongoose.model('Pulse', pulseSchema);
module.exports = Pulse;