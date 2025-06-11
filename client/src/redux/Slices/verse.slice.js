import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import axiosInstance from "../../config/axiosInstance";

const initialState = {
    downloadedVerse: [],
    verseList: [],
    savedList:[],
};

export const getAllVerse = createAsyncThunk('verse/getAllVerse', async () => {
    try {
        const response = await axiosInstance.get('verse/verse', {
            headers: {
                'x-access-token': localStorage.getItem('token')
            }
        });
        return response;
    } catch (error) {
        toast.error(error.response?.data?.error || "Failed to fetch verse");
    }
});

export const createVerse = createAsyncThunk('verse/createVerse', async (verseData) => {
    try {
        const response = await axiosInstance.post('verse/verse', verseData, {
            headers: {
                'x-access-token': localStorage.getItem('token')
            }
        });
        return response;
    } catch (error) {
        toast.error(error.response?.data?.error || "Failed to create verse");
    }
});

export const updateVerse = createAsyncThunk('verse/updateVerse',async(id, verseData) => {
    try {
        const response = await axiosInstance.patch(`verse/verse/${id}`, verseData , {
            headers: {
                'x-access-token': localStorage.getItem('token')
            }
        });
        if(response){
            return response;
        }
    } catch (error) {
        toast.error(error.response?.data?.error || "Failed to update verse");
    }
})

export const likeVerse = createAsyncThunk('verse/likeVerse', async(data) => {
    try {
        const resp = {
            id : data.id
        }
        const response = await axiosInstance.patch(`verse/like/${data._id}`, resp , {
            headers: {
                'x-access-token': localStorage.getItem('token')
            }
        })
        if(response){
            return response;
        }
    } catch (error) {
        toast.error(error.response?.data?.error || "Failed to like verse");
    }
})

export const getVerseByUserId = createAsyncThunk('verse/getVerse' ,async(id) => {
    try {
        const response = await axiosInstance.get(`verse/verse/${id}`, { 
            headers: {
                'x-access-token': localStorage.getItem('token')
            }
        })
        if(response){
            return response;
        }
    } catch (error) {
        toast.error(error.response?.data?.error || "Failed to get verse");
    }
})

export const getVerseById = createAsyncThunk('verse/getVerseById' ,async(id) => {
    try {
        const response = await axiosInstance.get(`verse/${id}`, { 
            headers: {
                'x-access-token': localStorage.getItem('token')
            }
        })
        if(response){
            return response;
        }
    } catch (error) {
        toast.error(error.response?.data?.error || "Failed to get verse");
    }
})

export const deleteVerse = createAsyncThunk('verse/delete' , async(data) => {
    try {        
        const response = axiosInstance.delete(`verse/${data.verseId}`, {
            headers: {
                'x-access-token': localStorage.getItem('token')
            },
            data: data.userId
        })
        if(response){
            return response;
        }
    } catch (error) {
        toast.error(error.response?.data?.error || "Failed to delete the verse");
    }
})

const VerseSlice = createSlice({
    name: 'verse',
    initialState,
    reducers: {
        filterVerseByUser: (state, action) => {
            const id = action.payload?.id;
            state.verseList = JSON.parse(JSON.stringify(state.downloadedVerse)).filter((verse) => verse.userId === id);
            state.verseList = JSON.parse(JSON.stringify(state.verseList));
        },
        filterVerseByLiked: (state, action) => {
            const id = action.payload?.id;
            state.verseList = JSON.parse(JSON.stringify(state.downloadedVerse)).filter((verse) => verse.likes?.includes (id));
            state.verseList = JSON.parse(JSON.stringify(state.verseList));
        },
        filterVerseByFollowing: (state, action) => {
            const following = action.payload?.following;
            state.verseList = JSON.parse(JSON.stringify(state.downloadedVerse)).filter((verse) => following.includes(verse.userId));
            state.verseList = JSON.parse(JSON.stringify(state.verseList));
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getAllVerse.fulfilled, (state, action) => {
                if (!action.payload?.data) return;
                state.downloadedVerse = action.payload?.data?.verse?.Verses?.reverse();
                state.verseList = state.downloadedVerse;
            })
            .addCase(createVerse.fulfilled, (state, action) => {
                if (!action.payload?.data) return;
                const newPost = action.payload?.data?.verse?.verse;
                state.downloadedVerse = [newPost, ...state.downloadedVerse];
            })
            .addCase(updateVerse.fulfilled, (state, action) => {
                if (!action.payload?.data) return;
            })
            .addCase(getVerseByUserId.fulfilled , (state,action) => {
                if(!action.payload?.data)return; 
                state.verseList = action.payload?.data?.verse?.reverse();
            })
    }
});

export const { filterVerseByFollowing, filterVerseByLiked, filterVerseByUser } = VerseSlice.actions;

export default VerseSlice.reducer;
