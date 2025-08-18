const Pulse = require('../models/pulse.model');
const User  = require('../models/user.model');
const Comment = require('../models/comment.model');
const { deleteVideos } = require('../../cloudConfig');
const { userSocketMap, getIO } = require('../../socket/socketInstance'); 
const Notification = require ('../models/notification.model')

const CreatePulse = async (data) => {
    const response = {};
    try {
        const pulseResponse = await Pulse.create(data);
        
        if (!pulseResponse) {
            response.error = "Pulse not created";
        } else {
            response.success = true;
            response.pulse = pulseResponse;

            const users = [];
            const matches = [...data.caption.matchAll(/(^|\s)@(\w+)/g)];

            for (const match of matches) {
                users.push(match[2]); // match[2] is the username without @
            }

            for (const username of users) {
                const user = await User.findOne({ username });

                if (user && user._id != data.userId) {
                    const notification = await Notification.create({
                        sender: data.userId,
                        recipient: user._id,
                        type: "mention",
                        targetType: "pulse",
                        pulse: pulseResponse._id,
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
};

const getAllPulse = async () => {
    const response = {};
    try {
        const allPulse = await Pulse.find({})
        .populate('user', 'image username') // Populate pulse's user with only image and username
        .populate({
            path: 'comments', // Populate pulse's comments
            populate: {
                path: 'user',   // Inside each comment, populate user
                select: 'image username' // but only take image and username
            }
        });         
          
        
        if (!allPulse || allPulse.length === 0) {
            response.error = "No pulse available";
        } else {
            response.success = true;
            response.pulse = allPulse;
        }
    } catch (error) {
        response.error = error.message;
    }
    return response;  
};


const likePulse = async(id, userId) => {
    const response = {};
    try {
        const pulse = await Pulse.findById(id);
        if(!pulse){
            response.error = "Pulse not found";
            return response;
        }
        if(pulse.likes.includes(userId)){
            pulse.likes = pulse.likes.filter((ids) => ids != userId);
        }else{
            pulse.likes.push(userId);

            // Notification 
            if(userId != pulse.user) {
                const notification = await Notification.create({
                    sender: userId,
                    recipient: pulse.user,
                    type: "like",
                    targetType: "pulse",
                    pulse: pulse._id,
                });

                // Immediately fetch the populated version
                const populatedNotification = await Notification.findById(notification._id)
                .populate("sender", "id username image")

                const recipientSocketId = userSocketMap.get(pulse.user.toString());
                if (recipientSocketId) {
                    getIO().to(recipientSocketId).emit("notification", populatedNotification);
                }
            }
        }

        const updatedPulse = await Pulse.findByIdAndUpdate(
            id,
            { likes: pulse.likes },
            { new: true } 
        );


        response.pulse = updatedPulse;
        return response;
    } catch (error) {
        response.error = error.message;
        return response;
    }
}

const getPulseByUserId = async(id) => {
    const response = {};
    try {
        const pulsedata = await Pulse.find({user : id })
            .populate('user', 'image username') // Populate pulse's user with only image and username
            .populate({
                path: 'comments', // Populate pulse's comments
                populate: {
                    path: 'user',   // Inside each comment, populate user
                    select: 'image username' // but only take image and username
                }
            });     ;
        if(!pulsedata){
            response.error = "Pulse not found";
            return response;
        }
        response.pulse = pulsedata;
        return response;
    } catch (error) {
        response.error = error.message;
        return response
    }
}

const getAllSavedPulse = async(userId) => {
    const response = {};
    try {
        const userData = await User.findById(userId);
        if(!userData){
            response.error = "User not found";
            return response;
        }

        const savedPulseDetails = await Pulse.find({ _id: { $in: userData.savedPulse } })
            .populate('user', 'image username') // Populate pulse's user with only image and username
            .populate({
                path: 'comments', // Populate pulse's comments
                populate: {
                    path: 'user',   // Inside each comment, populate user
                    select: 'image username' // but only take image and username
                }
            });     
        response.pulse = savedPulseDetails;
        return response;
    } catch (error) {
        response.error = error.message;
        return response
    }
}

const DeletePulse = async(id, userId) => {
    const response = {};
    try {
        const PulseDetails = await Pulse.findByIdAndDelete(id);

        // Cloudinary post data delete
        let videoFilenames = [];
        videoFilenames = videoFilenames.concat(PulseDetails.filename);
        try {
            if (videoFilenames.length) await deleteVideos(videoFilenames);
        } catch (cloudError) {
            console.log("Error deleting media:", cloudError);
        }
        //----------------------------

        const deletecomments = await Comment.deleteMany({postId : id});
        const userDetails = await User.findById(userId);
        let userDetailsSaved = userDetails.savedPulse;
        userDetailsSaved = userDetailsSaved.filter((ids) => ids != id);
        const updateUser = await User.findByIdAndUpdate(
            userId,
            {savedPulse : userDetailsSaved}
        )
        response.pulse = PulseDetails;
        return response;
    } catch (error) {
        response.error = error.message;
        return response
    }
}

const savePulse = async(userId, id) => {
    const response = {};
    try {
        let userData = await User.findById(userId);
        if(!userData){
            response.error = "User not found";
            return response;
        }

        if(userData.savedPulse.includes(id)){
            userData.savedPulse = userData.savedPulse.filter((ids) => ids !== id);
        }else{
            userData.savedPulse.push(id);
        }
        const updateuser = await User.findByIdAndUpdate(
            userId,
            {savedPulse : userData.savedPulse},
            {new  :true}
        )
        const savedPulseDetails = await Pulse.find({ _id: { $in: updateuser.savedPulse } });
        response.pulse = savedPulseDetails;
        return response;
    } catch (error) {
        response.error = error.message;
        return response
    }
}

const getPulseById = async(id) => {
    const response = {};
    try {
        const pulsedata = await Pulse.findById(id);
        if(!pulsedata){
            response.error = "Pulse not found!";
            return response;
        }
        response.pulse = pulsedata;
        return response;
    } catch (error) {
        response.error = error.message;
        return response
    }
}

const searchPulse = async(query) => {
    const response = {};
    try {
        const pulse = await Pulse.find({
            $or: [
                { caption: { $regex: query, $options: "i" } },
                { interests : { $regex: query, $options: "i" } }
            ]
        });
        response.pulse = pulse;
        return response;
    } catch (error) {
        response.error = error.message;
        return response
    }
}

module.exports = {
    CreatePulse,
    getAllPulse,
    likePulse,
    getPulseByUserId,
    getAllSavedPulse,
    DeletePulse,
    savePulse,
    getPulseById,
    searchPulse,
};
