const Verse = require ("../models/verse.model")
const Comments = require('../models/comment.model');

const create = async (data) => {
    const response = {};
    try{
        const verseData = {
            text: data.text,
            interests: data.interests,
            userId: data.userId
        }
        const res = await Verse.create (verseData);
        if (!res) {
            response.error = "Verse not created";
        } else {
            response.success = true;
            response.verse = res;
        }
    } catch (error) {
        response.error = error.message;
    }

    return response;
}

const getAllVerse = async () => {
    const response = {};
    try {
        const allVerse = await Verse.find({});
        
        if (!allVerse || allVerse.length === 0) {
            response.success = "No Verses available";
        } else {
            response.success = true;
            response.Verses = allVerse;
        }
    } catch (error) {
        response.error = error.message;
    }
    return response;  
};

const updateVerse = async (VerseId, updatedData) => {
    const response = {};
    try {

        const updatedVerse = await Verse.findByIdAndUpdate(
            VerseId, 
            updatedData, 
            { new: true, runValidators: true } 
        );

        if (!updatedVerse) {
            response.error = "Verse not found";
            return response;
        }
        
        response.Verse = updatedVerse;
        return response;
    } catch (error) {
        response.error = error.message;
        return response;
    }
};

const likeVerse = async(id,userId) => {
    const response = {};
    try {
        const likesArray = await Verse.findById(id);
        if(!likesArray){
            response.error = "Verse not found";
            return response;
        }
        if(likesArray.likes.includes(userId)){
            likesArray.likes = likesArray.likes.filter((ids) => ids!=userId);
        }else{
            likesArray.likes.push(userId);
        }
        const updatedVerse = await Verse.findByIdAndUpdate(
            id,
            { likes: likesArray.likes },
            { new: true } 
        );
        response.verse = updatedVerse;
        return response;
    } catch (error) {
        response.error = error.message;
        return response;
    }
}

const getVerseByUserId = async(id) => {
    const response = {};
    try {
        const verseData = await Verse.find({userId : id });
        if(!verseData){
            response.error = "Verse not found";
            return response;
        }
        response.verse = verseData;
        return response;
    } catch (error) {
        response.error = error.message;
        return response
    }
}

const getVerseById = async(id) => {
    const response = {};
    try {
        const verseData = await Verse.findById(id);
        if(!verseData){
            response.error = "Verse not found";
            return response;
        }
        response.verse = verseData;
        return response;
    } catch (error) {
        response.error = error.message;
        return response
    }
}

const getAllSavedPost = async(userId) => {

}

const savePost = async(userId, id) => {

}

const deleteVerse = async(id, userId) => {
    const response = {};
    try {
        const verseDetails = await Verse.findByIdAndDelete(id);

        const comments = await Comments.deleteMany({postId : id});

        response.verse = verseDetails;

        return response;
    } catch (error) {
        response.error = error.message;
        return response
    }
}

module.exports = {
    create, getAllVerse, updateVerse, getVerseByUserId, likeVerse, deleteVerse, getVerseById
};