
const commentService = require('../services/comments.service');
const { StatusCodes } = require('http-status-codes');

const CreateComment = async(req,res) => {
    const response = await commentService.CreateComment(req.body);
    if(response.error){
        return res.status(StatusCodes.BAD_REQUEST).send({
            msg : "Unable to post the comment",
            error : response.error,
        })
    }
    return res.status(StatusCodes.OK).send({
        msg : "Successfully posted the comment",
        commentDetails : response.comments
    })
}

const getCommentByPostId = async(req,res) => {
    const response = await commentService.getCommentByPostId(req.params.id);
    if(response.error){
        return res.status(StatusCodes.BAD_REQUEST).send({
            msg : "Unable to fetched the comment",
            error : response.error,
        })
    }
    return res.status(StatusCodes.OK).send({
        msg : "Successfully fetched the comment",
        commentDetails : response.comments
    })
}

const getPulseComments = async(req,res) => {
    const response = await commentService.getPulseComments();
    if(response.error){
        return res.status(StatusCodes.BAD_REQUEST).send({
            msg : "Unable to fetched the comment",
            error : response.error,
        })
    }
    return res.status(StatusCodes.OK).send({
        msg : "Successfully fetched the comment",
        commentDetails : response.comments
    })
}

module.exports = {
    CreateComment,
    getCommentByPostId,
    getPulseComments
}