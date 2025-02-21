const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
const { required } = require("joi");

const postSchema = new Schema({
    image:{
        type: [String],
        default: []
    },
    video:{
        type: [String],
        default: []
    },
    likes: {
        type: [String],
        default: []
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
        type : [String],
        required : true
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


const Post = mongoose.model('Posts', postSchema);
module.exports = Post;