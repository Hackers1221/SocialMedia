const postsmodel = require('../models/posts.model');

const CreatePost = async(data) => {
    const response = {};
    try {
        const postObject = {
            image : data.image,
            video : data.video,
            interests : data.interests,
            userId : data.userId
        }
        const postresponse = await postsmodel.create(postObject);
        if(!postresponse){
            response.error = "Posts not created";
            return response;
        }
        return response;
    } catch (error) {
        console.log(error);
        response.error = error.message;
    }
}

module.exports = { 
    CreatePost
}