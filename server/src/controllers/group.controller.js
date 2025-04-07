const { StatusCodes } = require('http-status-codes');
const groupService = require('../services/group.service')

const createGroup = async(req,res) => {
    const response = await groupService.createGroup(req.body);
    if(response.error){
                return res.status(StatusCodes.BAD_REQUEST).send({
                    msg : "Unable to create the group",
                    error : response.error
                })
            }
        return res.status(StatusCodes.CREATED).send({
            msg : "Successfully created the group",
            userdata: response.groupDetails
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
            userdata: response.groupDetails
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
            userdata: response.groupDetails
    })
}



module.exports = {
    createGroup,
    getGroupByUserId,
    getGroupById
}