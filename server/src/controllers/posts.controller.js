const { StatusCodes } = require('http-status-codes');
const postsService = require('../services/posts.service');

const createPost = async(req, res) => {
    const { caption, interests, userId } = req.body;

    // Extract file URLs from Cloudinary response
    const imageUrls = req.files.image ? req.files.image.map(file => file.path) : [];
    const videoUrls = req.files.video ? req.files.video.map(file => file.path) : [];

    const newPost = {
        userId,
        caption,
        interests,
        image: imageUrls,
        video: videoUrls,
    } 
    const response = await postsService.CreatePost(newPost);
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

const updatePost = async(req,res) => {
    const response = await postsService.updatePost(req.params.id,req.body);
    console.log(req.params.id,req.body);
    if(response.error){
        return res.status(StatusCodes.BAD_REQUEST).send({
            msg : "Unable to update the Post",
            error : response.error
        })
    }
    return res.status(StatusCodes.OK).send({
        msg : "Successfully updated the post",
        userDetails : response.post
    })
}

const likePost = async(req,res) => {
    const response = await postsService.likePost(req.params.id,req.body.id);
    console.log(req.params.id);
    if(response.error){
        return res.status(StatusCodes.BAD_REQUEST).send({
            msg : "Unable to update the Post",
            error : response.error
        })
    }
    return res.status(StatusCodes.OK).send({
        msg : "Successfully updated the post",
        postDetails : response.post
    })
}



module.exports = {
    createPost,
    getallPosts,
    updatePost,
    likePost
}
