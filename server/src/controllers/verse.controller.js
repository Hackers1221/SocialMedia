const { StatusCodes } = require('http-status-codes');
const verseService = require ('../services/verse.service')

const createVerse = async (req, res) => {
    const response = await verseService.create (req.body);

    if(response?.error){
        return res.status(StatusCodes.BAD_REQUEST).send({
            msg : "Something Went wrong",
            error : response.error
        })
    }
    return res.status(StatusCodes.CREATED).send({
        msg : "Successfully created the post",
        verse: response
    })
}

const getAllVerse = async(req, res) => {
    const response = await verseService.getAllVerse();
    if(response.error){
        return res.status(StatusCodes.BAD_REQUEST).send({
            msg : "Something Went wrong",
            error : response.error
        })
    }
    return res.status(StatusCodes.OK).send({
        msg : "All posts fetched",
        verse: response
    })
}

const updateVerse = async(req,res) => {
    const response = await verseService.updateVerse(req.params.id, req.body);

    if(response.error){
        return res.status(StatusCodes.BAD_REQUEST).send({
            msg : "Unable to update the Post",
            error : response.error
        })
    }
    return res.status(StatusCodes.OK).send({
        msg : "Successfully updated the post",
        verse : response.verse
    })
}

const likeVerse = async(req, res) => {
    const response = await verseService.likeVerse (req.params.id, req.body.id)
    if(response.error){
        return res.status(StatusCodes.BAD_REQUEST).send({
            msg : "Unable to update the Post",
            error : response.error
        })
    }
    return res.status(StatusCodes.OK).send({
        msg : "Successfully updated the post",
        verse : response.post
    })
}

const getVerseByUserId = async(req,res) => {
    const response = await verseService.getVerseByUserId (req.params.id);
    if(response.error){
        return res.status(StatusCodes.BAD_REQUEST).send({
            msg : "Unable to get the Post",
            error : response.error
        })
    }
    return res.status(StatusCodes.OK).send({
        msg : "Successfully fetched the post",
        verse : response.verse
    })
}

const getVerseById = async(req, res) => {
    const response = await verseService.getVerseById (req.params.id);
    if(response.error){
        return res.status(StatusCodes.BAD_REQUEST).send({
            msg : "Unable to get",
            error : response.error
        })
    }
    return res.status(StatusCodes.OK).send({
        msg : "Successfully fetched",
        postDetails : response.post
    })
}

const deleteVerse = async(req,res) => {
    console.log (req.params.id, req.body.id);
    const response = await verseService.deleteVerse(req.params.id, req.body.id);
    console.log (response);
    if(response.error){
        return res.status(StatusCodes.BAD_REQUEST).send({
            msg : "Unable to delete",
            error : response.error
        })
    }
    return res.status(StatusCodes.OK).send({
        msg : "Successfully deleted",
        verse : response.verse
    })
}

module.exports = {
    createVerse, likeVerse, getVerseByUserId, updateVerse, getAllVerse, getVerseById, deleteVerse
}