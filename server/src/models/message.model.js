const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const messageSchema = new Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
        required: true,
    },
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
    },
    content: {
        type: String,
    },
    files: [{
        name: { type: String, required: true },
        url: { type: String, required: true },
        filename: { type: String, required: true }
    }],
    timestamp: {
        type: Date,
        default: Date.now,
    },
    groupChat : {
        type : String,
        default : ""
    }
});

const Message = mongoose.model("Messages", messageSchema);
module.exports = Message;
