const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const storiesSchema = new Schema ({
    
})

const stories = mongoose.model('story',storiesSchema);
module.exports = stories