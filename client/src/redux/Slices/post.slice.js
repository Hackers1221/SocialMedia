import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import axiosInstance from "../../config/axiosInstance";

const initialState = {
    downloadedPosts: [],
    postList: [],
};

export const getAllPosts = createAsyncThunk('posts/getAllPosts', async () => {
    try {
        const response = axiosInstance.get('post/posts', {
            headers: {
                'x-access-token': localStorage.getItem('token')
            }
        });
        return await response;
    } catch (error) {
        toast.error (error);
    }
});

const PostSlice = createSlice({
    name: 'post',
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        builder
        .addCase(getAllPosts.fulfilled, (state, action) => {
            if(!action?.payload?.data) return;
            console.log (action.payload);
            state.downloadedPosts = action?.payload?.data?.postsdata?.posts.reverse();
            state.postList = state.downloadedPosts;
        })
    }
});


export default PostSlice.reducer;