
const MessageModel = require('../models/message.model')

const getMessage = async(sender,recipient) => {
    const response = {};
    try {
        const message1  = await MessageModel.find({
            sender : sender,
            recipient : recipient
        });
        const message2  = await MessageModel.find({
            sender : recipient,
            recipient : sender
        });
        response.messages = [...message1, ...message2];
        return response;
    } catch (error) {
        response.error = error.message;
        return response;
    }
}

module.exports = {
    getMessage
}