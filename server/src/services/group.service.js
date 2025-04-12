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

const getGroupById = async(id,userId) => {
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

const getRecentMessage = async (userId) => {
    const response = {};
    try {
      const currentUserId = new mongoose.Types.ObjectId(userId);
  
      const userGroups = await groupModel.find({
          members: {
            $elemMatch: {
              userId: currentUserId
            }
          }
        }).select("_id");      
  
      const groupIds =  userGroups.map((group) => group._id.toString());
  
      const recentChats = await MessageModel.aggregate([
        {
          $match: {
              groupId: { $in: groupIds },
          }
        },
        {
          $sort: { createdAt: -1 }
        },
        {
          $group: {
            _id: "$groupId",
            latestMessage: { $first: "$$ROOT" }
          }
        },
        {
          $replaceRoot: { newRoot: "$latestMessage" }
        },
        {
            $project: {
              content: 1,
              groupId: 1,
              messageType: 1,
              createdAt: 1
            }
          }
      ])

      const groupDetails = await groupModel.find({
        _id: { $in: recentChats.map(msg => msg.groupId) }
      }).select("name image");

      const enrichedChats = recentChats.map(msg => {
        const group = groupDetails.find(g => g._id.toString() === msg.groupId.toString());
        return {
          ...msg,
          group
        };
      });
  
      response.messages = enrichedChats;
      return response;
  
    } catch (error) {
      response.error = error.message;
      return response;
    }
};

module.exports = {
    createGroup,
    getGroupByUserId,
    getGroupById,
    getRecentMessage
}