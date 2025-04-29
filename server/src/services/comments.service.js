const { userSocketMap, getIO } = require('../../socket/socketInstance');
const commentsModel = require('../models/comment.model');
const Notification = require('../models/notification.model');
const postsModel = require('../models/posts.model')
const Verse = require ('../models/verse.model')

const CreateComment = async(data) => {
    const response = {};
    try {
        const commentsData = {
            description : data.description,
            user: data.userId,
            postId : data.postId,
        }
        const result = await commentsModel.create(commentsData);
        if(result){
            if (data.type === "post") {
                const postsData = await postsModel.findById(data.postId);
                postsData.comments.push(data.userId);
                await postsModel.findByIdAndUpdate(
                    data.postId,
                    {comments : postsData.comments },
                    {new : true}
                )
                const notification = await Notification.create({
                    sender: data.userId,
                    recipient: postsData.userId,
                    type: "comment",
                    targetType: "post",
                    post: postsData._id,
                    commentText: data.description,
                });
                // Immediately fetch the populated version
                const populatedNotification = await Notification.findById(notification._id)
                .populate("sender", "id username avatarUrl")
                .populate("post", "caption")
                .populate("pulse", "caption");

                const recipientSocketId = userSocketMap.get(postsData.userId.toString());
                if (recipientSocketId) {
                    getIO().to(recipientSocketId).emit("notification", populatedNotification);
                }
            }
            if (data.type === "verse") {
                const verseData = await Verse.findById(data.postId);
                verseData.comments.push(data.userId);
                await Verse.findByIdAndUpdate(
                    data.postId,
                    {comments : verseData.comments },
                    {new : true}
                )
            }
        }
        response.comments = result;
        return response;
    } catch (error) {
        response.error = error.message;
        return response;
    }
}

const getCommentByPostId = async(id) => {
    const response = {};
    try {
        const commentsData = await commentsModel.find({postId : id}).populate("user");
        response.comments = commentsData;
        return response;

    } catch (error) {
        response.error = error.message;
        return response;
    }
}



module.exports = {
    CreateComment,
    getCommentByPostId
}