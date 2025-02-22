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



module.exports = {
    CreatePost,
    getAllPosts
};
