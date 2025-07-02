const Announcement = require ("../models/announcement.model")
const User = require ("../models/user.model")
const mailerMiddleware = require ('../middlewares/mailer');
const Notification = require("../models/notification.model");
const { userSocketMap, getIO } = require('../../socket/socketInstance'); 

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

            const users = [];
            const matches = [...data.text.matchAll(/(^|\s)@(\w+)/g)];

            for (const match of matches) {
                users.push(match[2]); // match[2] is the username without @
            }

            for (const username of users) {
                const user = await User.findOne({ username });

                if (user && user._id != data.user) {

                    const notification = await Notification.create({
                        sender: data.user,
                        recipient: user._id,
                        type: "mention",
                        targetType: "announcement",
                        announcement: res._id,
                    });

                    const populatedNotification = await Notification.findById(notification._id)
                    .populate("sender", "id username image")

                    const recipientSocketId = userSocketMap.get (user._id.toString ());
                    if (recipientSocketId) {
                        getIO().to(recipientSocketId).emit("notification", populatedNotification);
                    }
                }
            }
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

        const idsToMatch = [...currentUser.following, userId];

        const announcements = await Announcement.find({ user: { $in: idsToMatch } })
        .populate("user", "image name username")
        
        if (!announcements || announcements.length === 0) {
            response.success = "No announcements available";
        } else {
            response.success = true;
            response.Announcement = announcements;
        }
    } catch (error) {
        response.error = error.message;
    }
    return response;  
};

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