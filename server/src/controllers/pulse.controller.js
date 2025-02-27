const { StatusCodes } = require('http-status-codes');
const pulseService = require('../services/pulse.service');

const createPulse = async(req, res) => {
    const { caption, interests, userId } = req.body;

    // Extract file URLs from Cloudinary response
    const videoUrl = req.file.path;
    const videoName = req.file.filename;
    console.log(req.file);

    const newPulse = {
        userId,
        caption,
        interests,
        video: videoUrl,
        filename: videoName
    } 
    console.log(newPulse);

    const response = await pulseService.CreatePulse(newPulse);
    if(response.error){
        return res.status(StatusCodes.BAD_REQUEST).send({
            msg : "Something Went wrong",
            error : response.error
        })
    }
    return res.status(StatusCodes.CREATED).send({
        msg : "Successfully created the post",
        pulsedata: response
    })
}

const getAllPulse = async(req,res) => {
    const response = await pulseService.getAllPulse();
    if(response.error){
        return res.status(StatusCodes.BAD_REQUEST).send({
            msg : "Something Went wrong",
            error : response.error
        })
    }
    return res.status(StatusCodes.OK).send({
        msg : "All pulse fetched",
        pulsedata: response
    })
}

module.exports = {
    createPulse,
    getAllPulse,
}
