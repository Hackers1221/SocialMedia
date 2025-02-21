import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import axiosInstance from "../../config/axiosInstance";

const initialState = {
    downloadedPosts: [],
    postList: [],
};

export const getAllPosts = createAsyncThunk('posts/getAllPosts', async () => {
    try {
        const response = await axiosInstance.get('post/posts', {
            headers: {
                'x-access-token': localStorage.getItem('token')
            }
        });
        return response;
    } catch (error) {
        toast.error(error.message || "Failed to fetch posts");
    }
});

export const createPost = createAsyncThunk('post/createPost', async (postData) => {
    try {
        console.log("hi",postData)
        const response = await axiosInstance.post('post/posts', postData, {
            headers: {
                'x-access-token': localStorage.getItem('token')
            }
        });
        return response;
    } catch (error) {
        toast.error(error.message || "Failed to create post");
    }
});

const PostSlice = createSlice({
    name: 'post',
    initialState,
    reducers: {
        filterPostsByUser: (state, action) => {
            const id = action.payload?.id;
            state.postList = state.downloadedPosts.filter((post) => post.userId === id);
            console.log(id);
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getAllPosts.fulfilled, (state, action) => {
                if (!action.payload?.data) return;
                state.downloadedPosts = action.payload?.data?.postsdata?.posts.reverse();
                state.postList = state.downloadedPosts;
            })
            .addCase(createPost.fulfilled, (state, action) => {
                if (!action.payload?.data) return;
                const newPost = action.payload?.data?.postsdata?.post;
                state.downloadedPosts = [newPost, ...state.downloadedPosts];
                state.postList = state.downloadedPosts;
            });
    }
});

export const { filterPostsByUser } = PostSlice.actions;

export default PostSlice.reducer;
