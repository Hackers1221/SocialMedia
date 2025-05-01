const { StatusCodes } = require('http-status-codes');
const postsService = require('../services/posts.service');

const createPost = async(req, res) => {
    const { caption, interests, userId } = req.body;

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
            message : "Could not create the post",
            error : response.error
        })
    }
    return res.status(StatusCodes.CREATED).send({
        message : "Successfully created the post",
        postsdata: response
    })
}

const getallPosts = async(req,res) => {
    const response = await postsService.getAllPosts();
    if(response.error){
        return res.status(StatusCodes.BAD_REQUEST).send({
            message : "Something Went wrong",
            error : response.error
        })
    }
    return res.status(StatusCodes.OK).send({
        message : "All posts fetched",
        postsdata: response
    })
}

const updatePost = async(req,res) => {
    const response = await postsService.updatePost(req.params.id,req.body);

    if(response.error){
        return res.status(StatusCodes.BAD_REQUEST).send({
            message : "Unable to update the Post",
            error : response.error
        })
    }
    return res.status(StatusCodes.OK).send({
        message : "Successfully updated the post",
        userDetails : response.post
    })
}

const likePost = async(req,res) => {
    const response = await postsService.likePost(req.params.id, req.body.id)
    if(response.error){
        return res.status(StatusCodes.BAD_REQUEST).send({
            message : "Unable to update the Post",
            error : response.error
        })
    }
    return res.status(StatusCodes.OK).send({
        message : "Successfully updated the post",
        postDetails : response.post
    })
}

const getPostByUserId = async(req,res) => {
    const response = await postsService.getPostByUserId(req.params.id);
    if(response.error){
        return res.status(StatusCodes.BAD_REQUEST).send({
            message : "Unable to get the Post",
            error : response.error
        })
    }
    return res.status(StatusCodes.OK).send({
        message : "Successfully fetched the post",
        postDetails : response.post
    })
}

const getPostById= async(req,res) => {
    const response = await postsService.getPostById(req.params.id);
    if(response.error){
        return res.status(StatusCodes.BAD_REQUEST).send({
            message : "Unable to fetch the post",
            error : response.error
        })
    }
    return res.status(StatusCodes.OK).send({
        message : "Successfully fetched the post",
        postDetails : response.post
    })
}

const savePost = async(req,res) => {
    const response = await postsService.savePost(req.params.id,req.body.id);
    if(response.error){
        return res.status(StatusCodes.BAD_REQUEST).send({
            message : "Unable to save the post",
            error : response.error
        })
    }
    return res.status(StatusCodes.OK).send({
        message : "Successfully saved the post",
        postDetails : response.post
    })
}

const getAllSavedPost = async(req,res) => {
    const response = await postsService.getAllSavedPost(req.params.id);
    if(response.error){
        return res.status(StatusCodes.BAD_REQUEST).send({
            message : "Unable to load the saved posts",
            error : response.error
        })
    }
    return res.status(StatusCodes.OK).send({
        message : "Successfully loaded all saved posts",
        postDetails : response.post
    })
}

const DeletePost = async(req,res) => {
    const response = await postsService.DeletePost(req.params.id,req.body.id);
    if(response.error){
        return res.status(StatusCodes.BAD_REQUEST).send({
            message : "Unable to delete the post",
            error : response.error
        })
    }
    return res.status(StatusCodes.OK).send({
        message : "Successfully deleted the post",
        postDetails : response.post
    })
}

const searchPost = async(req,res) => {
    const response = await postsService.searchPost(req.params.q);
    if(response.error){
        return res.status(StatusCodes.BAD_REQUEST).send({
            message : "Unable to search for the posts",
            error : response.error
        })
    }
    return res.status(StatusCodes.OK).send({
        message : "Successfully search for the posts",
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
    DeletePost,
    searchPost
}
