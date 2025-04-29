const { StatusCodes } = require('http-status-codes');
const NotificationService = require('../services/notification.service');

const deleteNonFR = async(req, res) => {
    const response = await NotificationService.deleteNonFR(req.params.userId);
    if(response.error){
        return res.status(StatusCodes.BAD_REQUEST).send({
            msg : "Unable to delete notifications",
            error : response.error,
        })
    }
    return res.status(StatusCodes.OK).send({
        msg : "Successfully deleted all recent notifications",
        result : response.result
    })
}
const rejectFR = async(req, res) => {
    const {sender, recipient} = req.body;
    const response = await NotificationService.rejectFR({sender, recipient});
    if(response.error){
        return res.status(StatusCodes.BAD_REQUEST).send({
            msg : "Unable to reject follow request",
            error : response.error,
        })
    }
    return res.status(StatusCodes.OK).send({
        msg : "Successfully rejected FR notification",
        result : response.result
    })
}
const acceptFR = async(req, res) => {
    const {sender, recipient} = req.body;
    const response = await NotificationService.acceptFR({sender, recipient});
    if(response.error){
        return res.status(StatusCodes.BAD_REQUEST).send({
            msg : "Unable to accept follow request",
            error : response.error,
        })
    }
    return res.status(StatusCodes.OK).send({
        msg : "Successfully accepted follow request",
        result : response.result
    })
}

module.exports = {
    deleteNonFR,
    rejectFR,
    acceptFR
}