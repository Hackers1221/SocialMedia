
const User = require('../models/user.model')
const Notification = require('../models/notification.model.js')
const Pulse = require("../models/pulse.model");
const Post = require("../models/posts.model");
const Verse = require ('../models/verse.model.js')
const Comment = require("../models/comment.model")
const Otp = require("../models/otp.model");
const bcrypt = require('bcrypt');
const mailer = require('../middlewares/mailer')
const {deleteImages, deleteVideos} = require("../../cloudConfig.js");
const { userSocketMap, getIO } = require('../../socket/socketInstance.js');
const mongoose = require("mongoose");

const CreateUser = async(data) => { 
    const response  = {};

    try {
        let user = await User.findOne({ username: data.username });
        if (user) {
            response.error = "Username already exists";
            return response;
        }

        if (!data.email) {
            response.error = "Please start sign up again";
            return response;
        }
        const userObject = {
            image: {
                url: "https://cdn.pixabay.com/photo/2018/11/13/21/43/avatar-3814049_1280.png",
                filename :""  
            },
            name :  data.name,
            username : data.username,
            email : data.email , 
            password  : data.password,
            birth : data.birth
        }
        let res = await User.create(userObject);
        response.user = res;

        await mailer.sendWelcomeEmail(data.email); 
        return response;
    } catch (error) {
        response.error = error.message;
        return response ; 
    }
};

const ValidateUser = async (data, password) => {
    const response = {};
    try {
        let res = await User.findOne({ email: data });
        if (!res) {
            res = await User.findOne({ username: data });
            if (!res) {
                response.error = "Invalid username or email";
                return response;
            }
        }
        let notif = await Notification.find({ recipient: res._id })
            .populate("sender", "id username avatarUrl")
            .populate("post", "caption")       
            .populate("pulse", "caption");

        const result = bcrypt.compareSync(password, res.password);
        if (!result) {
            response.error = "Invalid password";
            return response;
        }

        response.userdata = res;
        response.notifications = notif;

        return response;
    } catch (error) {
        response.error = error.message;
        return response;
    }
};


const getuserByid = async(id) => {
    const response = {};
    try {
        const userdetails = await User.findById(id);
        if(!userdetails){
            response.error = "User not found";
        }else{
            response.user = userdetails;
        }
        return response;

    } catch (error) {
        response.error = error.message;
        return response ; 
    }
}

const followRequest = async(userId , followingId) => {
    const response = {};
    try {
        const userData = await User.findById(userId);
        const followingData = await User.findById(followingId);
        if(!userData || !followingId){
            response.error = error.message;
            return response;
        }
    
        if(followingData.requests.includes(userId)){
            followingData.requests = followingData.requests.filter ((ids) => ids != userId);
            await Notification.deleteMany({
                recipient: followingId,
                sender: userId,
                type: "follow-request",
            });
        }else{
            followingData.requests.push(userId);
                // Check if a notification already exists
            const existingNotification = await Notification.findOne({
                recipient: followingId,
                sender: userId,
                type: "follow-request",
            });

            if (!existingNotification) {
                // Create a new follow request notification
                const notification = await Notification.create({
                    recipient: followingId,
                    sender: userId,
                    type: "follow-request",
                });
                // Immediately fetch the populated version
                const populatedNotification = await Notification.findById(notification._id)
                .populate("sender", "id username avatarUrl")
                .populate("post", "caption")
                .populate("pulse", "caption");

                const recipientSocketId = userSocketMap.get(followingId.toString());
                if (recipientSocketId) {
                    getIO().to(recipientSocketId).emit("notification", populatedNotification);
                }
            }
        }

        const updatefollower = await User.findByIdAndUpdate(
            followingId, 
            {requests: followingData.requests},
            { new: true, runValidators: true } 
        );

        response.user = updatefollower;
        return response;
    } catch (error) {
        response.error = error.message;
        return response;
    }
}
const followUser = async(userId , followingId) => {
    const response = {};
    try {
        const userData = await User.findById(userId);
        const followingData = await User.findById(followingId);
        if(!userData || !followingId){
            response.error = error.message;
            return response;
        }

        if(userData.following.includes(followingId)){
            userData.following = userData.following.filter ((ids) => ids != followingId);
        }else{
            if(!followingData.isPrivate || followingData.requests.includes(userId)) 
                userData.following.push(followingId);
        }

        if(followingData.follower.includes(userId)){
            followingData.follower = followingData.follower.filter((ids) => ids != userId);
        }
        else{
            if(!followingData.isPrivate || followingData.requests.includes(userId)) {
                followingData.follower.push(userId);
                if(followingData.isPrivate) {
                    await Notification.deleteMany({
                        recipient: followingId,
                        sender: userId,
                        type: "follow-request",
                    });
                    followingData.requests = followingData.requests.filter ((ids) => ids != userId);
                }
            }
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId, 
            {following : userData.following},
            { new: true, runValidators: true } 
        );
        const updateFollowing = await User.findByIdAndUpdate(
            followingId,
            {
                follower: followingData.follower,
                requests: followingData.requests
            },
            { new: true, runValidators: true }
        );
        

        response.user = updatedUser;
        return response;
    } catch (error) {
        response.error = error.message;
        return response;
    }
}

const getUserByUserName = async(name) => {
    const response = {};
    try {
        const userData = await User.findOne({username : name});
        if(!userData){
            response.error = "User not found";
            return response;
        }
        response.user = userData;
        return response;
    } catch (error) {
        response.error = error.message;
        return response;
    }
}
const updateUser = async(newData) => {
    const response = {};
    try {
        const userData = await User.findById(newData.id);
        if (!userData) {
            response.error = "User not found";
            return response;
        }
        if(newData.curpassword){
            const result = bcrypt.compareSync(newData.curpassword, userData.password);
            if(!result){
                response.error = "Current password does not match";
                return response;
            }
            newData.password = await bcrypt.hash(newData.password, 11);
        }
        else {
            newData.password = userData.password;
        }
        
        const val = newData.id;
        delete newData.id;
        delete newData.curpassword;
        const updateuser = await User.findByIdAndUpdate(
            val , 
            newData,
            {new : true}
        )
        response.user = updateuser;
        return response;
    } catch (error) {
        response.error = error.message;
        return response
    }
}
const deleteUser = async(id) => {
    const response = {};
    try {
        const userData = await User.findById(id);
        if(!userData){
            response.error = "User not found";
            return response;
        }

        // Remove user from other users' following & follower lists
        await User.updateMany({ following: id }, { $pull: { following: id } });
        await User.updateMany({ follower: id }, { $pull: { follower: id } });

        // Remove user likes from posts, pulses and comments
        await Post.updateMany({ likes: id }, { $pull: { likes: id } });
        await Pulse.updateMany({ likes: id }, { $pull: { likes: id } });
        await Verse.updateMany({ likes: id }, { $pull: { likes: id } });
        await Comment.updateMany({ likes: id }, { $pull: { likes: id } });

        // Find all comments made by the user
        const userComments = await Comment.find({ user: id });

        // Remove user's comments from posts
        await Post.updateMany({ comments: id }, { $pull: { comments: id } });

        // Remove user's comments from pulse
        await Pulse.updateMany({ comments: id }, { $pull: { comments: id } });

        // Remove user's comments from verse
        await Verse.updateMany({ comments: id }, { $pull: { comments: id } });

        // Delete the user's comments
        await Comment.deleteMany({ user: id });

        // Delete posts and pulse from cloudinary
        const allPosts = await Post.find({ userId: id });
        const allPulse = await Pulse.find({ userId: id });
        
        let imageFilenames = [];
        let videoFilenames = [];

        if (userData.image && userData.image.filename) {
            imageFilenames.push(userData.image.filename);
        } // profile image

        allPosts.forEach(post => {
            if (post.image) {
                imageFilenames = imageFilenames.concat(post.image.map(img => img.filename));
            }
            if (post.video) {
                videoFilenames = videoFilenames.concat(post.video.map(vid => vid.filename));
            }
        });
        allPulse.forEach(pulse => {
            if (pulse.filename) {
                videoFilenames.push(pulse.filename);
            }
        });
    
        try {
            if (imageFilenames.length) await deleteImages(imageFilenames);
            if (videoFilenames.length) await deleteVideos(videoFilenames);
        } catch (cloudError) {
            console.log("Error deleting media:", cloudError);
        }

        // Delete user's posts & pulses
        await Post.deleteMany({ userId: id });
        await Pulse.deleteMany({ userId: id });
        await Verse.deleteMany({ userId: id });


        // Remove OTP data (if any)
        await Otp.deleteMany({ email: userData.email });

        // Finally, delete the user
        await User.findByIdAndDelete(id);

        response.success = true;
        response.message = "User deleted successfully along with related data";
        return response;

    } catch (error) {
        response.error = error.message;
        return response;
    }
}


const searchUser = async(query) => {
    const response = {};
    try {
        const users = await User.find({
            $or: [
                { username: { $regex: query, $options: "i" } },
                { name : { $regex: query, $options: "i" } }
            ]
        }).limit(5);
        response.user = users;
        return response;
    } catch (error) {
        response.error = error.message;
        return response
    }
}

const searchFollower = async(userId,query) => {
    const response = {};
    try {
        const currentUser = await User.findById(userId);
        const followerIds = currentUser.follower.map(id => new mongoose.Types.ObjectId(id));
        const users = await User.find({
            _id: { $in: followerIds },
            $or: [
                { username: { $regex: query, $options: "i" } },
                { name: { $regex: query, $options: "i" } }
            ]
        });
        response.user = users;
        return response;
    } catch (error) {
        response.error = error.message;
        return response
    }
}

const getFollowerDetails = async(userId) => {
    const response = {};
    try {
        const currentUser = await User.findById(userId);
        const followerIds = currentUser.follower.map(id => new mongoose.Types.ObjectId(id));
        const users = await User.find({
            _id: { $in: followerIds },
        });
        response.user = users;
        return response;
    } catch (error) {
        response.error = error.message;
        return response
    }
}

const getUserByLimit = async (userId, limit) => {
    const response = {};
    try {
        const users = await User.find({
            _id: { $ne: userId },               // Exclude the user with the given userId
            follower: { $nin: [userId] }       // Exclude users who have userId in their followers array
        }).limit(limit);        
        response.user = users;
        return response;
    } catch (error) {
        response.error = error.message;
        return response
    }
}

const getTopUser = async () => {
    const response = {};
    try {
        const topUsers = await User.find({})
        .select('username follower image')
        .lean()
        .then(users => {
            return users
            .map(user => ({
                _id: user._id,
                username: user.username,
                image: user.image,
                followerCount: user.follower.length
            }))
            .sort((a, b) => b.followerCount - a.followerCount)
            .slice(0, 10); // if only 3 users exist, returns 3
        });
        response.users = topUsers;
        return response;
    } catch (error) {
        response.error = error.message;
        return response;
    }
}

module.exports = {
    CreateUser,
    ValidateUser,
    getuserByid,
    updateUser,
    followUser,
    getUserByUserName,
    deleteUser,
    searchUser,
    getUserByLimit,
    followRequest,
    searchFollower,
    getFollowerDetails,
    getTopUser
}

