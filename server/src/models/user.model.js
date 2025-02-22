const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt')

const userSchema = new Schema({
    image:{
        type: String,
        // required: [true, 'Image cannot be empty'],
        default: ""
    },
    name: {
        type: String,
        required: [true, 'Name cannot be empty']
    },
    username: {
        type: String,
        required: [true, 'Name cannot be empty'],
        match : /^[a-z0-9]+$/
    },
    likedPosts : {
        type : [String],
        default : []
    },
    email: {
        type: String,
        required: [true, 'Email cannot be empty'],
        unique : true
    },
    password: {
        type: String,
        minLength: 5,
        required: true,
        match: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%?&])[A-Za-z\d@$!%?&]{5,}$/
,
    },
    following: {
        type: [String],
        default :[]
    },
    birth:{
        type: String,
        required: true,
    },
    saved : [{
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
    }]
});

userSchema.pre('save', function(next) {
    const hashedPassword = bcrypt.hashSync(this.password, 11);
    this.password = hashedPassword;
    next();
});

const User = mongoose.model('Users', userSchema);
module.exports = User;