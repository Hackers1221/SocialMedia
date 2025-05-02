const postsmodel = require('../models/posts.model');
const usermodel  = require('../models/user.model');
const commentsModel = require('../models/comment.model');
const Notification = require("../models/notification.model")
const { deleteImages, deleteVideos } = require('../../cloudConfig');
const { userSocketMap, getIO } = require('../../socket/socketInstance'); 

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

const likePost = async(id, userId) => {
    const response = {};
    try {
        const post = await postsmodel.findById(id);
        if(!post){
            response.error = "Post not found";
            return response;
        }
        if(post.likes.includes(userId)){
            post.likes = post.likes.filter((ids) => ids!=userId);
        }else{
            post.likes.push(userId);
            
            // Notification 
            if(userId !== post.userId) {
                const notification = await Notification.create({
                    sender: userId,
                    recipient: post.userId,
                    type: "like",
                    targetType: "post",
                    post: post._id,
                });

                // Immediately fetch the populated version
                const populatedNotification = await Notification.findById(notification._id)
                .populate("sender", "id username avatarUrl")
                .populate("post", "caption")
                .populate("pulse", "caption");

                const recipientSocketId = userSocketMap.get(post.userId.toString());
                if (recipientSocketId) {
                    getIO().to(recipientSocketId).emit("notification", populatedNotification);
                }
            }
        }
        const updatedPost = await postsmodel.findByIdAndUpdate(
            id,
            { likes: post.likes },
            { new: true } 
        );
        response.post = updatedPost;
        return response;
    } catch (error) {
        console.log(error.message);
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
        const savedPostDetails = await postsmodel.find({ _id: { $in: userData.savedPost } });
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

        if(userData.savedPost.includes(id)){
            userData.savedPost = userData.savedPost.filter((ids) => ids!==id);
        }else{
            userData.savedPost.push(id);
        }
        const updateuser = await usermodel.findByIdAndUpdate(
            userId,
            {savedPost : userData.savedPost},
            {new  :true}
        )
        const savedPostDetails = await postsmodel.find({ _id: { $in: updateuser.savedPost } });
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

        // Cloudinary post data delete
        let imageFilenames = [];
        let videoFilenames = [];

        if (PostDetails.image) {
            imageFilenames = imageFilenames.concat(PostDetails.image.map(img => img.filename));
        }
        if (PostDetails.video) {
            videoFilenames = videoFilenames.concat(PostDetails.video.map(vid => vid.filename));
        }
        try {
            if (imageFilenames.length) await deleteImages(imageFilenames);
            if (videoFilenames.length) await deleteVideos(videoFilenames);
        } catch (cloudError) {
            console.log("Error deleting media:", cloudError);
        }
        //----------------------------

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

const searchPost = async(query) => {
    const response = {};
    try {
        const posts = await postsmodel.find({
            $or: [
                { caption: { $regex: query, $options: "i" } },
                { interests : { $regex: query, $options: "i" } }
            ]
        });
        response.post = posts;
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
    DeletePost,
    searchPost
};
