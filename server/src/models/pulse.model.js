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
    comments: [{
        type: Schema.Types.ObjectId,
        ref: 'Comments'
    }],    
    interests : {
        type : String,
    },
    user : {
        type : Schema.Types.ObjectId,
        ref: 'Users'
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
});

const Pulse = mongoose.model('Pulse', pulseSchema);
module.exports = Pulse;