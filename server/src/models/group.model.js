const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const GroupSchema = new Schema({
    name : {
        type : String,
        required : true
    },
    members : {
        type : [
            {
                userId : {
                    type : Schema.Types.ObjectId,
                    required : true
                },
                joinedAt : {
                    type: Date,
                    default: Date.now()
                },
                addedBy :{
                    type : Schema.Types.ObjectId,
                    ref:"Users"
                },
                isActive :{
                    type : Boolean,
                }
            }
        ],
        required : true
    },
    image: {
        url: { type: String },
        filename: { type: String }
    },
    admins : {
        type : [Schema.Types.ObjectId],
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
});


const Group = mongoose.model('Group', GroupSchema);
module.exports = Group;