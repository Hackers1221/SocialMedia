
const commentsModel = require('../models/comment.model');
const postsModel = require('../models/posts.model');
const Pulse = require('../models/pulse.model');
const Verse = require ('../models/verse.model')

const CreateComment = async(data) => {
    const response = {};
    try {
        const commentsData = {
            description : data.description,
            user: data.userId,
            postId : data.postId,
            type: data.type
        }

        console.log (commentsData)
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

module.exports = {
    CreateComment,
    getCommentByPostId,
    getPulseComments
}