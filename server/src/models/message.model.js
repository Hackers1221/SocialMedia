import { required } from "joi";

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
    // messageType: {
    //     type: String,
    //     enum: ["text", "file"],
    //     required: true,
    // },
    content: {
        type: String,
        // required: function () {
        //     return this.messageType === "text";
        // },
        required: true
    },
    // fileUrl: {
    //     type: String,
    //     required: function () {
    //     return this.messageType === "file";
    //     },
    // },
    timestamp: {
        type: Date,
        default: Date.now,
    },
});

const Message = mongoose.model("Messages", messageSchema);
export default Message;
