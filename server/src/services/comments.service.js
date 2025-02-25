
const commentsModel = require('../models/comment.model')

const CreateComment = async(data) => {
    const response = {};
    try {
        const commentsData = {
            description : data.description,
            userId : data.userId,
            postId : data.postId,
        }
        const result = await commentsModel.create(commentsData);
        response.comments = result;
        return response;
    } catch (error) {
        response.error = error.message;
        return response;
    }
}

module.exports = {
    CreateComment
}