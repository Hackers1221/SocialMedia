const postsmodel = require('../models/posts.model');

const CreatePost = async (data) => {
    const response = {};
    try {
        const postObject = {
            image: data.image,
            video: data.video,
            interests: data.interests,
            userId: data.userId,
            caption: data.caption,
        };
        const postresponse = await postsmodel.create(postObject);
        
        if (!postresponse) {
            response.error = "Post not created";
        } else {
            response.success = true;
            response.post = postresponse;
        }
    } catch (error) {
        console.log(error);
        response.error = error.message;
    }
    return response;  
};

const getAllPosts = async () => {
    const response = {};
    try {
        const allPosts = await postsmodel.find({});
        
        if (!allPosts || allPosts.length === 0) {
            response.error = "No posts available";
        } else {
            response.success = true;
            response.posts = allPosts;
        }
    } catch (error) {
        response.error = error.message;
    }
    return response;  
};


const updatePost = async (postId, updatedData) => {
    const response = {};
    try {

        const updatedPost = await postsmodel.findByIdAndUpdate(
            postId, 
            updatedData, 
            { new: true, runValidators: true } 
        );

        if (!updatedPost) {
            response.error = "Post not found";
            return response;
        }
        
        response.post = updatedPost;
        return response;
    } catch (error) {
        response.error = error.message;
        return response;
    }
};

const likePost = async(id,userId) => {
    const response = {};
    try {
        const likesArray = await postsmodel.findById(id);
        if(!likesArray){
            response.error = "Post not found";
            return response;
        }
        if(likesArray.likes.includes(userId)){
            likesArray.likes = likesArray.likes.filter((ids) => ids!=userId);
        }else{
            likesArray.likes.push(userId);
        }
        const updatedPost = await postsmodel.findByIdAndUpdate(
            id,
            { likes: likesArray.likes },
            { new: true } 
        );
        response.post = updatedPost;
        return response;
    } catch (error) {
        response.error = error.message;
        return response;
    }
}


module.exports = {
    CreatePost,
    getAllPosts,
    updatePost,
    likePost
};
