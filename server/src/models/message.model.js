const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const messageSchema = new Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
    },
    recipient: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
    }],    
    content: {
        type: String,
    },
    files: [{
        name: { type: String, required: true },
        url: { type: String, required: true },
        filename: { type: String, required: true }
    }],
    createdAt: {
        type: Date,
        default: Date.now,
    },
    groupId : {
        type : String,
        default : ""
    },
    targetType: {
        type: String,
        required: true
    },
    postId: {
        type: String,
        required: function () {
            return this.targetType !== "message";
        }
    },
    messageType : {
        type : Boolean,
        default : false
    }
});

const Message = mongoose.model("Messages", messageSchema);
module.exports = Message;
