
const User = require('../models/user.model')
const Pulse = require("../models/pulse.model");
const Post = require("../models/posts.model");
const Verse = require ('../models/verse.model.js')
const Comment = require("../models/comment.model")
const Otp = require("../models/otp.model");
const bcrypt = require('bcrypt');
const mailer = require('../middlewares/mailer')
const {deleteImages, deleteVideos} = require("../../cloudConfig.js");
const { response } = require('express');
const { default: mongoose } = require('mongoose');

const CreateUser = async(data) => { 
    const response  = {};

    try {
        const userObject = {
            image: {
                url: "https://img.freepik.com/premium-vector/avatar-profile-icon-flat-style-male-user-profile-vector-illustration-isolated-background-man-profile-sign-business-concept_157943-38764.jpg?semt=ais_hybrid",
                filename :""  
            },
            name :  data.name,
            username : data.username,
            email : data.email , 
            password  : data.password,
            birth : data.birth
        }
        response.user = await User.create(userObject);
        await mailer.sendWelcomeEmail(data.email); 
        return response;
    } catch (error) {
        console.log("Error" , error);
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

        const result = bcrypt.compareSync(password, res.password);
        if (!result) {
            response.error = "Invalid password";
            return response;
        }

        response.userdata = res;
        return response;
    } catch (error) {
        console.log("Error", error);
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
        console.log("Error" , error);
        response.error = error.message;
        return response ; 
    }
}

const followUser = async(userId , followingId) => {
    const response = {};
    try {
        const userData = await User.findById(userId);
        if(!userData){
            response.error = error.message;
            return response;
        }
        if(userData.following.includes(followingId)){
            userData.following = userData.following.filter ((ids) => ids!=followingId);
        }else{
            userData.following.push(followingId);
        }
        const followingData = await User.findById(followingId);
        if(!followingId){
            response.error = error.message;
            return response;
        }
        if(followingData.follower.includes(userId)){
            followingData.follower = followingData.follower.filter((ids) => ids!=userId);
        }else{
            followingData.follower.push(userId);
        }
        const updatedUser = await User.findByIdAndUpdate(
            userId, 
            {following : userData.following},
            { new: true, runValidators: true } 
        );
        const updatefollower= await User.findByIdAndUpdate(
            followingId, 
            {follower : followingData.follower},
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
    console.log (newData);
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
    searchFollower,
    getFollowerDetails
}

