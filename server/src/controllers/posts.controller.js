const { StatusCodes } = require('http-status-codes');
const postsService = require('../services/posts.service');

const createPost = async(req, res) => {
    const { caption, interests, userId } = req.body;
    console.log(req.files);

    // Extract file URLs from Cloudinary response
    const images = req.files.image 
    ? req.files.image.map(file => ({ url: file.path, filename: file.filename })) 
    : [];

    const videos = req.files.video 
    ? req.files.video.map(file => ({ url: file.path, filename: file.filename })) 
    : [];

    const newPost = {
        userId,
        caption,
        interests,
        image: images,
        video: videos,
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
    const response = await postsService.likePost(req.params.id,req.body.id)
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

const getPostByUserId = async(req,res) => {
    const response = await postsService.getPostByUserId(req.params.id);
    if(response.error){
        return res.status(StatusCodes.BAD_REQUEST).send({
            msg : "Unable to get the Post",
            error : response.error
        })
    }
    return res.status(StatusCodes.OK).send({
        msg : "Successfully fetched the post",
        postDetails : response.post
    })
}

const getPostById= async(req,res) => {
    const response = await postsService.getPostById(req.params.id);
    if(response.error){
        return res.status(StatusCodes.BAD_REQUEST).send({
            msg : "Unable to get the Post",
            error : response.error
        })
    }
    return res.status(StatusCodes.OK).send({
        msg : "Successfully fetched the post",
        postDetails : response.post
    })
}

const savePost = async(req,res) => {
    const response = await postsService.savePost(req.params.id,req.body.id);
    if(response.error){
        return res.status(StatusCodes.BAD_REQUEST).send({
            msg : "Unable to save the Post",
            error : response.error
        })
    }
    return res.status(StatusCodes.OK).send({
        msg : "Successfully saved the post",
        postDetails : response.post
    })
}

const getAllSavedPost = async(req,res) => {
    const response = await postsService.getAllSavedPost(req.params.id);
    if(response.error){
        return res.status(StatusCodes.BAD_REQUEST).send({
            msg : "Unable to load the save Post",
            error : response.error
        })
    }
    return res.status(StatusCodes.OK).send({
        msg : "Successfully loaded the saved post",
        postDetails : response.post
    })
}

const DeletePost = async(req,res) => {
    const response = await postsService.DeletePost(req.params.id,req.body.id);
    if(response.error){
        return res.status(StatusCodes.BAD_REQUEST).send({
            msg : "Unable to delete the  Post",
            error : response.error
        })
    }
    return res.status(StatusCodes.OK).send({
        msg : "Successfully deleted the saved post",
        postDetails : response.post
    })
}


module.exports = {
    createPost,
    getallPosts,
    updatePost,
    likePost,
    getPostByUserId,
    getPostById,
    savePost,
    getAllSavedPost,
    DeletePost
}
