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
            userdata: response
    })
}

module.exports = {
    createGroup
}