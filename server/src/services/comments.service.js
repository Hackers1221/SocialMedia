
const commentsModel = require('../models/comment.model');
const postsModel = require('../models/posts.model')

const CreateComment = async(data) => {
    const response = {};
    try {
        const commentsData = {
            description : data.description,
            userId : data.userId,
            postId : data.postId,
        }
        const result = await commentsModel.create(commentsData);
        if(result){
            const postsData = await postsModel.findById(data.postId);
            postsData.comments.push(data.userId);
            const updatePost = await postsModel.findByIdAndUpdate(
                data.postId,
                {comments : postsData.comments },
                {new : true}
            )
        }
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