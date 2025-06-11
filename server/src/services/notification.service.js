const Notification = require('../models/notification.model');
const userService = require('../services/user.service');

const deleteNonFR = async (userId) => {
    const response = {};
    try {
        const result = await Notification.deleteMany({
            type: { $in: ["like", "comment"] },
            recipient: userId,
        });
        response.result = result;
        return response;
    } catch (err) {
        response.error = err.message;
        console.error("Error deleting non-FR notifications:", err);
        return response;
    }
};

const rejectFR = async ({sender, recipient}) => {
    const response = {};
    try {
        const result = await Notification.deleteMany({
            recipient,
            sender,
            type: "follow-request",
        });

        response.result = result;
        return response;
    } catch (err) {
        response.error = err.message;
        console.error("Error rejecting FR notifications:", err);
        return response;
    }
};

const acceptFR = async ({sender, recipient}) => {
    const response = {};
    try {
        const result = await userService.followUser(sender, recipient);
        response.result = result;
        return response;
    } catch (err) {
        response.error = err.message;
        console.error("Error accepting FR notifications:", err);
        return response;
    }
};

module.exports = {
    deleteNonFR,
    rejectFR,
    acceptFR
}