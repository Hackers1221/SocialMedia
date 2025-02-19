const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt')

const userSchema = new Schema({
    image:{
        type: String,
        required: [true, 'Image cannot be empty'],
        default: ""
    },
    name: {
        type: String,
        required: [true, 'Name cannot be empty']
    },
    username: {
        type: String,
        required: [true, 'Name cannot be empty']
    },
    email: {
        type: String,
        required: [true, 'Email cannot be empty']
    },
    password: {
        type: String,
        minLength: 5,
        required: true,
        match: /^(?=.[A-Za-z])(?=.\d)(?=.[@$!%#?&])[A-Za-z\d@$!%*#?&]{5,}$/,
    },
    following: {
        type: [String]
    },
    birth:{
        type: Date,
        required: true,
    }
});

userSchema.pre('save', function(next) {
    const hashedPassword = bcrypt.hashSync(this.password, 11);
    this.password = hashedPassword;
    next();
});

const User = mongoose.model('Users', userSchema);
module.exports = User;