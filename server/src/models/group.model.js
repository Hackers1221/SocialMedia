const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const GroupSchema = new Schema({
    name : {
        type : String,
        required : true
    },
    members : {
        type : [String],
        required : true
    },
    image: {
        url: { type: String },
        filename: { type: String }
    },
    admins : {
        type : [String],
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
});


const Group = mongoose.model('Group', GroupSchema);
module.exports = Group;