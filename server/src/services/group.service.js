const groupModel = require('../models/group.model')
const MessageModel = require('../models/message.model');
const { default: mongoose } = require("mongoose");

const createGroup = async(data,messageData) => {
    const response = {};
    try {
        const groupData = await groupModel.create(data);
        response.groupDetails = groupData;
        return response;
    } catch (error) {
        response.error = error.message;
        return response;
    }
}

const getGroupByUserId = async(userId) => {
    const response = {};
    try {
        const objectId = new mongoose.Types.ObjectId(userId);
        const groupData = await groupModel.find({
            "members.userId": objectId
        });

        response.groupDetails = groupData
        return response;
    } catch (error) {
        response.error = error.message;
        return response;
    }
}

const getGroupById = async(id) => {
    const response = {};
    try {
        let groupData = await groupModel.findById(id);
        const messages = await MessageModel.find ({ groupId: id}).populate("sender", "id username image"); 

        response.groupDetails = {
            ...groupData.toObject(),
            messages
        };

        return response;
    } catch (error) {
        response.error = error.message;
        return response;
    }
}

module.exports = {
    createGroup,
    getGroupByUserId,
    getGroupById
}