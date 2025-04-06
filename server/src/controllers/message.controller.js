
const { StatusCodes } = require('http-status-codes');
const MessageService = require('../services/message.service');

const getMessage = async(req,res) => {
    const response = await MessageService.getMessage(req.query.sender,req.query.recipient);
    if(response.error){
        return res.status(StatusCodes.BAD_REQUEST).send({
            msg : "Unable to fetched the messages",
            error : response.error,
        })
    }
    return res.status(StatusCodes.OK).send({
        msg : "Successfully fetched the messages",
        messages : response.messages
    })
}

const getRecentMessage = async(req,res) => {
    const response = await MessageService.getRecentMessage(req.params.id);
    if(response.error){
        return res.status(StatusCodes.BAD_REQUEST).send({
            msg : "Unable to fetched the messages",
            error : response.error,
        })
    }
    return res.status(StatusCodes.OK).send({
        msg : "Successfully fetched the messages",
        messages : response.messages
    })
}

module.exports = {
    getMessage,
    getRecentMessage
}