const groupModel = require('../models/group.model')

const createGroup = async(data) => {
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

const getGroupByUserId = async(id) => {
    const response = {};
    try {
        const groupData = await groupModel.find({
            members : id
        })
        response.groupDetails = groupData;
        return response;
    } catch (error) {
        response.error = error.message;
        return response;
    }
}

module.exports = {
    createGroup,
    getGroupByUserId
}