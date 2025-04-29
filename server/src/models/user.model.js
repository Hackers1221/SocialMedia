const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt')

const userSchema = new Schema({
    image: {
        url: { type: String },
        filename: { type: String }
    },
    name: {
        type: String,
        required: [true, 'Name cannot be empty']
    },
    username: {
        type: String,
        required: [true, 'Name cannot be empty'],
    },
    isPrivate : {
        type : Boolean,
        default : false
    },
    about : {
        type : String , 
        default : ""
    },
    likedPosts : {
        type : [String],
        default : []
    },
    requests: {
        type: [String], 
        default: []
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
    },
    saved : {
        type : [String],
        default : []
    },
    following: {
        type: [String],
        default :[]
    },
    follower: {
        type: [String],
        default :[]
    },
    birth:{
        type: String,
        required: true,
    },
    resetToken : {
        type : String,
    },
    resetTokenExpiry: {
        type: Date,
        default : Date.now()
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

userSchema.pre('save', function(next) {
    const hashedPassword = bcrypt.hashSync(this.password, 11);
    this.password = hashedPassword;
    next();
});

const User = mongoose.model('Users', userSchema);
module.exports = User;