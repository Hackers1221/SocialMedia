const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
const { required } = require("joi");

const postSchema = new Schema({
    image: [{
        url: { type: String, required: true },
        filename: { type: String, required: true }
    }],
    video: [{
        url: { type: String, required: true },
        filename: { type: String, required: true }
    }],
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
        type : mongoose.Schema.Types.ObjectId,
        ref: "Users",
        required : true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});


const Post = mongoose.model('Posts', postSchema);
module.exports = Post;