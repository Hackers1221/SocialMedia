const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const verseSchema = new Schema({
    likes: {
        type: [String],
        default: []
    },
    text: {
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
        default: Date.now
    }
});


const Verse = mongoose.model('Verses', verseSchema);
module.exports = Verse;