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
        filterPostsByUser: (state, action) => {
            const id = action?.payload?.id;
            state.postList = state.downloadedPosts.filter((post) => post.userId == id);
            state.postList = JSON.parse(JSON.stringify(state.postList));
            console.log (state.downloadedPosts.filter((post) => post.userId == id));
        },
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

export const { filterPostsByUser } = PostSlice.actions;

export default PostSlice.reducer;