const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const announcementSchema = new Schema({
    likes: {
        type: [String],
        default: []
    },
    text: {
        type: String,
        default: ""
    },
    user : {
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        ref: "Users"
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 86400
    }
});


const Announcement = mongoose.model('Announcement', announcementSchema);
module.exports = Announcement;