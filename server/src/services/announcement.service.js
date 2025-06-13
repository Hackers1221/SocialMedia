const Announcement = require ("../models/announcement.model")
const User = require ("../models/user.model")
const mailerMiddleware = require ('../middlewares/mailer');
// const Comments = require('../models/comment.model');

const create = async (data) => {
    const response = {};
    try{
        let res = await Announcement.create (data);
        res = await res.populate("user", "image name username")

        const fromUser = await User.findById (data.user);
        fromUser.follower.forEach (async (user) => {
            const toUser = await User.findById (user); 
            const sent = mailerMiddleware.announcementAddedEmail (fromUser, toUser);
        })
        if (!res) {
            response.error = "Announcement not created";
        } else {
            response.success = true;
            response.announcement = res;
        }
    } catch (error) {
        response.error = error.message;
    }

    return response;
}

const getAll = async (userId) => {
    const response = {};
    try {
        const currentUser = await User.findById(userId);

        const idsToMatch = [...currentUser.follower, userId];

        const announcements = await Announcement.find({ user: { $in: idsToMatch } })
        .populate("user", "image name username")
        
        if (!announcements || announcements.length === 0) {
            response.success = "No Verses available";
        } else {
            response.success = true;
            response.Announcement = announcements;
        }
    } catch (error) {
        response.error = error.message;
    }
    return response;  
};

// const updateVerse = async (VerseId, updatedData) => {
//     const response = {};
//     try {

//         const updatedVerse = await Verse.findByIdAndUpdate(
//             VerseId, 
//             updatedData, 
//             { new: true, runValidators: true } 
//         );

//         if (!updatedVerse) {
//             response.error = "Verse not found";
//             return response;
//         }
        
//         response.Verse = updatedVerse;
//         return response;
//     } catch (error) {
//         response.error = error.message;
//         return response;
//     }
// };

const congratulate = async(id, userId) => {
    const response = {};
    try {
        const res = await Announcement.updateOne(
            { _id: id },
            { $push: { congratulations: userId } }
        );

        response.announcement = await Announcement.findById (id).populate("user", "image name username");
        return response;
    } catch (error) {
        response.error = error.message;
        return response;
    }
}

const sorrify = async(id, userId) => {
    const response = {};
    try {
        const res = await Announcement.updateOne(
            { _id: id },
            { $push: { sorry: userId } }
        );

        response.announcement = await Announcement.findById (id).populate("user", "image name username");
        return response;
    } catch (error) {
        response.error = error.message;
        return response;
    }
}

// const getVerseByUserId = async(id) => {
//     const response = {};
//     try {
//         const verseData = await Verse.find({userId : id });
//         if(!verseData){
//             response.error = "Verse not found";
//             return response;
//         }
//         response.verse = verseData;
//         return response;
//     } catch (error) {
//         response.error = error.message;
//         return response
//     }
// }

// const getVerseById = async(id) => {
//     const response = {};
//     try {
//         const verseData = await Verse.findById(id);
//         if(!verseData){
//             response.error = "Verse not found";
//             return response;
//         }
//         response.verse = verseData;
//         return response;
//     } catch (error) {
//         response.error = error.message;
//         return response
//     }
// }

// const getAllSavedPost = async(userId) => {

// }

// const savePost = async(userId, id) => {

// }

const deleteAnnouncement = async(id) => {
    const response = {};
    try {
        console.log (id);
        const announcement = await Announcement.findByIdAndDelete(id);
        response.announcement = announcement;

        return response;
    } catch (error) {
        response.error = error.message;
        return response
    }
}

module.exports = {
    create, getAll, deleteAnnouncement, congratulate, sorrify
};