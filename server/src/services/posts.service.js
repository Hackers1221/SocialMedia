const Posts = require('../models/posts.model');
const usermodel  = require('../models/user.model');
const commentsModel = require('../models/comment.model');
const Notification = require("../models/notification.model")
const { deleteImages, deleteVideos } = require('../../cloudConfig');
const { userSocketMap, getIO } = require('../../socket/socketInstance'); 
const User = require('../models/user.model');

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
        const post = await Posts.create(postObject);
        
        if (!post) {
            response.error = "Post not created";
        } else {
            response.success = true;
            response.post = post;

            const users = [];
            const matches = [...data.caption.matchAll(/(^|\s)@(\w+)/g)];

            for (const match of matches) {
                users.push(match[2]); // match[2] is the username without @
            }

            for (const username of users) {
                const user = await User.findOne({ username });

                if (user) {

                    const notification = await Notification.create({
                        sender: data.userId,
                        recipient: user._id,
                        type: "mention",
                        targetType: "post",
                        post: post._id,
                    });

                    const populatedNotification = await Notification.findById(notification._id)
                    .populate("sender", "id username image")

                    const recipientSocketId = userSocketMap.get (user._id.toString ());
                    if (recipientSocketId) {
                        getIO().to(recipientSocketId).emit("notification", populatedNotification);
                    }
                }
            }
        }
    } catch (error) {
        response.error = error.message;
    }
    return response;  
};

const getAllPosts = async () => {
    const response = {};
    try {
        const allPosts = await Posts.find({});
        
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

        const updatedPost = await Posts.findByIdAndUpdate(
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
        const post = await Posts.findById(id);
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
                .populate("sender", "id username image")
                .populate("post", "caption")
                .populate("pulse", "caption");

                const recipientSocketId = userSocketMap.get(post.userId.toString());
                if (recipientSocketId) {
                    getIO().to(recipientSocketId).emit("notification", populatedNotification);
                }
            }
        }
        const updatedPost = await Posts.findByIdAndUpdate(
            id,
            { likes: post.likes },
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
        const postdata = await Posts.find({userId : id });
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
        const postdata = await Posts.findById(id);
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
        const savedPostDetails = await Posts.find({ _id: { $in: userData.savedPost } });
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
        const savedPostDetails = await Posts.find({ _id: { $in: updateuser.savedPost } });
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
        const PostDetails = await Posts.findById(id);

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
        const userDetailsSaved = userDetails.savedPost.filter ((ids) => ids!=id);
        const updateUser = await usermodel.findByIdAndUpdate(
            userId,
            {savedPost : userDetailsSaved}
        )

        const post = await Posts.findByIdAndDelete(id);

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
        const posts = await Posts.find({
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

const getExplorePost = async (userId) => {
    const response = {};
    try {
        const posts = await Posts.find(
            { likes: userId },           // Filter: only posts where liked array includes userId
            { interests: 1, _id: 0 }     // Projection: only return the 'interests' field
        );

        const allInterests = posts
            .flatMap(post => post.interests || [])          // Flatten arrays, handle missing interests
            .filter(str => str && str.trim() !== '')        // Remove empty strings or whitespace-only
            .join(' ');                                     // Join with space

        response.interests = allInterests;
        return response;
    } catch (error) {
        response.error = error.message;
        return response;
    }
};


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
    searchPost,
    getExplorePost
};
