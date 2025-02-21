const { StatusCodes } = require('http-status-codes');
const postsService = require('../services/posts.service');

const createPost = async(req,res) => {
    const response = await postsService.CreatePost(req.body);
    if(response.error){
        return res.status(StatusCodes.BAD_REQUEST).send({
            msg : "Something Went wrong",
            error : response.error
        })
    }
    return res.status(StatusCodes.CREATED).send({
        msg : "Successfully created the post",
        postsdata: response
    })
}

const getallPosts = async(req,res) => {
    console.log ("Hello");
    const response = await postsService.getAllPosts();
    if(response.error){
        return res.status(StatusCodes.BAD_REQUEST).send({
            msg : "Something Went wrong",
            error : response.error
        })
    }
    return res.status(StatusCodes.OK).send({
        msg : "All posts fetched",
        postsdata: response
    })
}

module.exports = {
    createPost,
    getallPosts
}