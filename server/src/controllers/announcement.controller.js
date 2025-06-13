const { StatusCodes } = require('http-status-codes');
const announcementService = require ('../services/announcement.service')

const createAnnouncement = async (req, res) => {
    console.log (req.body)
    const response = await announcementService.create (req.body);

    if(response?.error){
        return res.status(StatusCodes.BAD_REQUEST).send({
            msg : "Something Went wrong",
            error : response.error
        })
    }
    return res.status(StatusCodes.CREATED).send({
        msg : "Successfully created the announcement",
        announcement: response
    })
}

const getAllAnnouncement = async(req, res) => {
    const response = await announcementService.getAll(req.params.userId);
    if(response.error){
        return res.status(StatusCodes.BAD_REQUEST).send({
            msg : "Something Went wrong",
            error : response.error
        })
    }
    return res.status(StatusCodes.OK).send({
        msg : "All announcement fetched",
        announcement: response
    })
}

// const updateVerse = async(req,res) => {
//     const response = await verseService.updateVerse(req.params.id, req.body);

//     if(response.error){
//         return res.status(StatusCodes.BAD_REQUEST).send({
//             msg : "Unable to update the Post",
//             error : response.error
//         })
//     }
//     return res.status(StatusCodes.OK).send({
//         msg : "Successfully updated the post",
//         verse : response.verse
//     })
// }

// const likeVerse = async(req, res) => {
//     const response = await verseService.likeVerse (req.params.id, req.body.id)
//     if(response.error){
//         return res.status(StatusCodes.BAD_REQUEST).send({
//             msg : "Unable to update the Post",
//             error : response.error
//         })
//     }
//     return res.status(StatusCodes.OK).send({
//         msg : "Successfully updated the post",
//         verse : response.post
//     })
// }

// const getVerseByUserId = async(req,res) => {
//     const response = await verseService.getVerseByUserId (req.params.id);
//     if(response.error){
//         return res.status(StatusCodes.BAD_REQUEST).send({
//             msg : "Unable to get the Post",
//             error : response.error
//         })
//     }
//     return res.status(StatusCodes.OK).send({
//         msg : "Successfully fetched the post",
//         verse : response.verse
//     })
// }

// const getVerseById = async(req, res) => {
//     const response = await verseService.getVerseById (req.params.id);
//     if(response.error){
//         return res.status(StatusCodes.BAD_REQUEST).send({
//             msg : "Unable to get",
//             error : response.error
//         })
//     }
//     return res.status(StatusCodes.OK).send({
//         msg : "Successfully fetched",
//         postDetails : response.post
//     })
// }

const deleteAnnouncement = async(req,res) => {
    const response = await announcementService.deleteAnnouncement(req.params.id);

    if(response.error){
        return res.status(StatusCodes.BAD_REQUEST).send({
            msg : "Unable to delete",
            error : response.error
        })
    }
    return res.status(StatusCodes.OK).send({
        msg : "Successfully deleted",
        announcement : response.announcement
    })
}

module.exports = {
    createAnnouncement, getAllAnnouncement, deleteAnnouncement
    // likeVerse, getVerseByUserId, updateVerse, getVerseById, deleteVerse
}