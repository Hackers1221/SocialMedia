const { StatusCodes } = require('http-status-codes');
const groupService = require('../services/group.service')

const createGroup = async(req,res) => {
    const image = {
        url: req.file.path,
        filename: req.file.filename
    }

    const groupData = {
        name: req.body.name,
        admins: req.body.admin,
        members: req.body.members,
        image
    }

    const response = await groupService.createGroup(groupData,req.body.messageData);
    if(response.error){
        return res.status(StatusCodes.BAD_REQUEST).send({
            msg : "Unable to create the group",
            error : response.error
        })
    }
    return res.status(StatusCodes.CREATED).send({
        msg : "Successfully created the group",
        groupData: response.groupDetails
    })
}

const getGroupByUserId = async(req,res) => {
    const response = await groupService.getGroupByUserId(req.params.userId);
    if(response.error){
        return res.status(StatusCodes.BAD_REQUEST).send({
            msg : "Unable to fetch the groupdetals",
            error : response.error
        })
    }
    return res.status(StatusCodes.CREATED).send({
        msg : "Successfully fetched the group details",
        groupData: response.groupDetails
    })
}

const getGroupById = async(req,res) => {
    const response = await groupService.getGroupById(req.params.id);
    if(response.error){
        return res.status(StatusCodes.BAD_REQUEST).send({
            msg : "Unable to fetch the groupdetals",
            error : response.error
        })
    }
        return res.status(StatusCodes.CREATED).send({
            msg : "Successfully fetched the group details",
            groupData: response.groupDetails
    })
}

const getRecentMessage = async(req,res) => {
    const response = await groupService.getRecentMessage(req.params.userId);
    if(response.error){
        return res.status(StatusCodes.BAD_REQUEST).send({
            msg : "Unable to fetch the recent group chats",
            error : response.error
        })
    }
        return res.status(StatusCodes.CREATED).send({
            msg : "Successfully fetched the recent group chats",
            recentChats: response.messages,
    })
}



module.exports = {
    createGroup,
    getGroupByUserId,
    getGroupById,
    getRecentMessage
}