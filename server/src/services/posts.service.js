const postsmodel = require('../models/posts.model');
const usermodel  = require('../models/user.model');
const commentsModel = require('../models/comment.model')

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

const getPostByUserId = async(id) => {
    const response = {};
    try {
        const postdata = await postsmodel.find({userId : id });
        if(!postdata){
            response.error = "Post not found";
            return response;
        }
        response.post = postdata;
        return response;
    } catch (error) {
        response.error = error.message;
        return response
    }
}

const getPostById = async(id) => {
    const response = {};
    try {
        const postdata = await postsmodel.findById(id);
        if(!postdata){
            response.error = "Post not found";
            return response;
        }
        response.post = postdata;
        return response;
    } catch (error) {
        response.error = error.message;
        return response
    }
}

const getAllSavedPost = async(userId) => {
    const response = {};
    try {
        const userData = await usermodel.findById(userId);
        if(!userData){
            response.error = "User not found";
            return response;
        }
        const savedPostDetails = await postsmodel.find({ _id: { $in: userData.saved } });
        response.post = savedPostDetails;
        return response;
    } catch (error) {
        response.error = error.message;
        return response
    }
}

const savePost = async(userId, id) => {
    const response = {};
    try {
        let userData = await usermodel.findById(userId);
        if(!userData){
            response.error = "User not found";
            return response;
        }
        console.log(userData);
        if(userData.saved.includes(id)){
            userData.saved = userData.saved.filter((ids) => ids!==id);
        }else{
            userData.saved.push(id);
        }
        const updateuser = await usermodel.findByIdAndUpdate(
            userId,
            {saved : userData.saved},
            {new  :true}
        )
        const savedPostDetails = await postsmodel.find({ _id: { $in: updateuser.saved } });
        response.post = savedPostDetails;
        return response;
    } catch (error) {
        response.error = error.message;
        return response
    }
}

const DeletePost = async(id,userId) => {
    const response = {};
    try {
        const PostDetails = await postsmodel.findByIdAndDelete(id);
        const deletecomments = await commentsModel.deleteMany({postId : id});
        const userDetails = await usermodel.findById(userId);
        let userDetailsSaved = userDetails.saved;
        userDetailsSaved = userDetailsSaved.filter((ids) => ids!=id);
        const updateUser = await usermodel.findByIdAndUpdate(
            userId,
            {saved : userDetailsSaved}
        )
        response.post = PostDetails;
        return response;
    } catch (error) {
        response.error = error.message;
        return response
    }
}

module.exports = {
    CreatePost,
    getAllPosts,
    updatePost,
    likePost,
    getPostByUserId,
    getPostById,
    savePost,
    getAllSavedPost,
    DeletePost
};
