const { userSocketMap, getIO } = require('../../socket/socketInstance');
const commentsModel = require('../models/comment.model');
const Notification = require('../models/notification.model');
const postsModel = require('../models/posts.model');
const Verse = require ('../models/verse.model')
const Pulse = require ('../models/pulse.model');
const { findByIdAndDelete, findByIdAndUpdate } = require('../models/otp.model');

const CreateComment = async(data) => {
    const response = {};
    try {
        const commentsData = {
            description : data.description,
            user: data.userId,
            postId : data.postId,
            type: data.type
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
            if (data.type === "pulse") {
                const pulsedata = await Pulse.findById(data.postId);
                pulsedata.comments.push(data.userId);
                await Pulse.findByIdAndUpdate(
                    data.postId,
                    {comments : pulsedata.comments },
                    {new : true}
                )
                const notification = await Notification.create({
                    sender: data.userId,
                    recipient: pulsedata.user,
                    type: "comment",
                    targetType: "pulse",
                    pulse: pulsedata._id,
                    commentText: data.description,
                });
                // Immediately fetch the populated version
                const populatedNotification = await Notification.findById(notification._id)
                .populate("sender", "id username avatarUrl")
                .populate("post", "caption")
                .populate("pulse", "caption");

                const recipientSocketId = userSocketMap.get(pulsedata.user.toString());
                if (recipientSocketId) {
                    getIO().to(recipientSocketId).emit("notification", populatedNotification);
                }
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

const getPulseComments = async() => {
    const response = {};
    try {
        const commentsData = await commentsModel.find({type : "pulse"}).populate("user");
        response.comments = commentsData;
        return response;

    } catch (error) {
        response.error = error.message;
        return response;
    }
}

const likeComment = async (commentId, userId) => {
    const response = {};
    try {
      const comment = await commentsModel.findById( commentId );
      if (!comment) {
        response.error = "Comment not found";
        return response;
      }
  
      let likesArray = comment.likes || [];
  
      if (likesArray.includes(userId)) {
        likesArray = likesArray.filter((id) => id !== userId);
      } else {
        likesArray.push(userId);
      }
      const updatedComment = await commentsModel.findByIdAndUpdate(
        comment._id,
        { likes: likesArray },
        { new: true }
      );
  
      response.comment = updatedComment;
      return response;
    } catch (error) {
      response.error = error.message;
      return response;
    }
  };
  

module.exports = {
    CreateComment,
    getCommentByPostId,
    getPulseComments,
    likeComment
}