const { StatusCodes } = require('http-status-codes');
const pulseService = require('../services/pulse.service');

const createPulse = async(req, res) => {
    const { caption, interests, user } = req.body;

    // Extract file URLs from Cloudinary response
    const videoUrl = req.file.path;
    const videoName = req.file.filename;

    const newPulse = {
        user,
        caption,
        interests,
        video: videoUrl,
        filename: videoName
    } 

    const response = await pulseService.CreatePulse(newPulse);
    if(response.error){
        return res.status(StatusCodes.BAD_REQUEST).send({
            message : "Something Went wrong",
            error : response.error
        })
    }
    return res.status(StatusCodes.CREATED).send({
        message : "Successfully created the post",
        pulsedata: response
    })
}

const getAllPulse = async(req,res) => {
    const response = await pulseService.getAllPulse();
    if(response.error){
        return res.status(StatusCodes.BAD_REQUEST).send({
            message : "Something Went wrong",
            error : response.error
        })
    }
    return res.status(StatusCodes.OK).send({
        message : "All pulse fetched",
        pulsedata: response
    })
}

const likePulse = async(req,res) => {
    const response = await pulseService.likePulse(req.params.id,req.body.id)
    if(response.error){
        return res.status(StatusCodes.BAD_REQUEST).send({
            message : "Unable to update the Pulse",
            error : response.error
        })
    }
    return res.status(StatusCodes.OK).send({
        message : "Successfully updated the Pulse",
        postDetails : response.post
    })
}

const getPulseByUserId = async(req, res) => {
    const response = await pulseService.getPulseByUserId(req.params.id);
    if(response.error){
        return res.status(StatusCodes.BAD_REQUEST).send({
            message : "Unable to get the Pulse",
            error : response.error
        })
    }
    return res.status(StatusCodes.OK).send({
        message : "Successfully fetched the pulse",
        pulseDetails : response.pulse
    })
}

const getAllSavedPulse = async(req, res) => {
    const response = await pulseService.getAllSavedPulse(req.params.id);
    if(response.error){
        return res.status(StatusCodes.BAD_REQUEST).send({
            message : "Unable to load the save Pulse",
            error : response.error
        })
    }
    return res.status(StatusCodes.OK).send({
        message : "Successfully loaded the saved pulse",
        pulseDetails : response.pulse
    })
}

const DeletePulse = async(req, res) => {
    const response = await pulseService.DeletePulse(req.params.id, req.body.id);
    if(response.error){
        return res.status(StatusCodes.BAD_REQUEST).send({
            message : "Unable to delete the  Pulse",
            error : response.error
        })
    }
    return res.status(StatusCodes.OK).send({
        message : "Successfully deleted the saved pulse",
        pulseDetails : response.pulse
    })
}

const savePulse = async(req, res) => {
    const response = await pulseService.savePulse(req.params.id, req.body.id);
    if(response.error){
        return res.status(StatusCodes.BAD_REQUEST).send({
            message : "Unable to save the Pulse",
            error : response.error
        })
    }
    return res.status(StatusCodes.OK).send({
        message : "Successfully saved the pulse",
        pulseDetails : response.pulse
    })
}

const getPulseById= async(req, res) => {
    const response = await pulseService.getPulseById(req.params.id);
    if(response.error){
        return res.status(StatusCodes.BAD_REQUEST).send({
            message : "Unable to get the Pulse",
            error : response.error
        })
    }
    return res.status(StatusCodes.OK).send({
        message : "Successfully fetched the pulse",
        pulseDetails : response.pulse
    })
}

const searchPulse = async(req, res) => {
    const response = await pulseService.searchPulse(req.params.q);
    if(response.error){
        return res.status(StatusCodes.BAD_REQUEST).send({
            message : "Unable to fetch the search Pulse",
            error : response.error
        })
    }
    return res.status(StatusCodes.OK).send({
        message : "Successfully fetched the search pulse",
        pulseDetails : response.pulse
    })
}

module.exports = {
    createPulse,
    getAllPulse,
    likePulse,
    getPulseByUserId,
    getAllSavedPulse,
    DeletePulse,
    savePulse,
    getPulseById,
    searchPulse
}
