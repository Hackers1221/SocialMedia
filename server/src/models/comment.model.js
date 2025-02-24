const { required } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const commentSchema = new Schema({
    value: {
        type: String,
        required: true,
    },
    likes: {
        type: [String],
        default: []
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

const Comment = mongoose.model('Comments', commentSchema);
module.exports = Comment;