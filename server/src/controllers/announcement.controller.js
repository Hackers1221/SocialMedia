const { StatusCodes } = require('http-status-codes');
const announcementService = require ('../services/announcement.service')

const createAnnouncement = async (req, res) => {
    const response = await announcementService.create (req.body);

    if(response?.error){
        return res.status(StatusCodes.BAD_REQUEST).send({
            msg : "Something Went wrong",
            error : response.error
        })
    }
    return res.status(StatusCodes.CREATED).send({
        msg : "Successfully created the announcement",
        announcement: response
    })
}

const getAllAnnouncement = async(req, res) => {
    const response = await announcementService.getAll(req.params.userId);
    if(response.error){
        return res.status(StatusCodes.BAD_REQUEST).send({
            msg : "Something Went wrong",
            error : response.error
        })
    }
    return res.status(StatusCodes.OK).send({
        msg : "All announcement fetched",
        announcement: response
    })
}

const congratulate = async(req, res) => {
    const response = await announcementService.congratulate (req.params.id, req.body.id)
    if(response.error){
        return res.status(StatusCodes.BAD_REQUEST).send({
            msg : "Unable to update the announcement",
            error : response.error
        })
    }
    return res.status(StatusCodes.OK).send({
        msg : "Successfully updated the announcement",
        announcement : response.announcement
    })
}

const sorrify = async(req, res) => {
    const response = await announcementService.sorrify (req.params.id, req.body.id)
    if(response.error){
        return res.status(StatusCodes.BAD_REQUEST).send({
            msg : "Unable to update the announcement",
            error : response.error
        })
    }
    return res.status(StatusCodes.OK).send({
        msg : "Successfully updated the announcement",
        announcement : response.announcement
    })
}

const deleteAnnouncement = async(req,res) => {
    const response = await announcementService.deleteAnnouncement(req.params.id);

    if(response.error){
        return res.status(StatusCodes.BAD_REQUEST).send({
            msg : "Unable to delete",
            error : response.error
        })
    }
    return res.status(StatusCodes.OK).send({
        msg : "Successfully deleted",
        announcement : response.announcement
    })
}

module.exports = {
    createAnnouncement, getAllAnnouncement, deleteAnnouncement, congratulate, sorrify
}