import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import axiosInstance from "../../config/axiosInstance";

const initialState = {
    downloadedPosts: [],
    postList: [],
    savedList:[],
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
        console.log(postData)
        const response = await axiosInstance.post('post/posts', postData, {
            headers: {
                'x-access-token': localStorage.getItem('token')
            }
        });
        return response;
    } catch (error) {
        console.log (error.message);
        toast.error(error.message || "Failed to create post");
    }
});

export const updatePost = createAsyncThunk('post/updatePost',async(id,postdata) => {
    try {
        const response = await axiosInstance.patch(`post/posts/${id}`, postdata , {
            headers: {
                'x-access-token': localStorage.getItem('token')
            }
        });
        if(response){
            return response;
        }
    } catch (error) {
        toast.error(error.message || "Failed to update post");
    }
})

export const likePost = createAsyncThunk('post/likePost', async(data) => {
    try {
        const resp = {
            id : data.id
        }
        const response = await axiosInstance.patch(`post/like/${data._id}`,resp , {
            headers: {
                'x-access-token': localStorage.getItem('token')
            }
        })
        if(response){
            return response;
        }
    } catch (error) {
        toast.error(error.message || "Failed to update post");
    }
})

export const getPostByUserId = createAsyncThunk('post/getpost' ,async(id) => {
    try {
        const response = await axiosInstance.get(`post/posts/${id}`, { 
            headers: {
                'x-access-token': localStorage.getItem('token')
            }
        })
        if(response){
            return response;
        }
    } catch (error) {
        toast.error(error.message || "Failed to get post");
    }
})

export const getSavedPost = createAsyncThunk('post/getSavedPost' , async(id) => {
    try {
        const response = await axiosInstance.get(`post/save/${id}`, {
            headers: {
                'x-access-token': localStorage.getItem('token')
            }
        })
        if(response){
            return response;
        }
    } catch (error) {
        toast.error(error.message || "Failed to save post");
    }
})

export const updateSavedPost = createAsyncThunk('post/updatesavedPost', async(data) => {
    try {
        const resp = {
            id : data.id
        }
        const response = await axiosInstance.patch(`post/save/${data._id1}`,resp , {
            headers: {
                'x-access-token': localStorage.getItem('token')
            }
        })
        if(response){
            return response;
        }
    } catch (error) {
        toast.error(error.message || "Failed to update post");
    }
})

export const DeletePost = createAsyncThunk('post/delete' , async(data) => {
    try {
        // console.log(id,JSON.stringify(userId));
        console.log (data);
        
        const response = axiosInstance.delete(`post/${data.postId}`, {
            headers: {
                'x-access-token': localStorage.getItem('token')
            },
            data: data.userId
        })
        if(response){
            return response;
        }
    } catch (error) {
        console.log(error);
    }
})

const PostSlice = createSlice({
    name: 'post',
    initialState,
    reducers: {
        filterPostsByUser: (state, action) => {
            const id = action.payload?.id;
            state.postList = JSON.parse(JSON.stringify(state.downloadedPosts)).filter((post) => post.userId === id);
            state.postList = JSON.parse(JSON.stringify(state.postList));
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getAllPosts.fulfilled, (state, action) => {
                if (!action.payload?.data) return;
                state.downloadedPosts = action.payload?.data?.postsdata?.posts.reverse();
            })
            .addCase(createPost.fulfilled, (state, action) => {
                if (!action.payload?.data) return;
                const newPost = action.payload?.data?.postsdata?.post;
                state.downloadedPosts = [newPost, ...state.downloadedPosts];
            })
            .addCase(updatePost.fulfilled, (state, action) => {
                if (!action.payload?.data) return;
                console.log(action.payload);
            })
            .addCase(getPostByUserId.fulfilled , (state,action) => {
                if(!action.payload?.data)return; 
                state.postList = action.payload?.data?.postDetails.reverse();
            })
            .addCase(getSavedPost.fulfilled,(state,action) => {
                if(!action.payload?.data)return; 
                state.savedList = action.payload?.data?.postDetails.reverse();
            })
            .addCase(updateSavedPost.fulfilled,(state,action) => {
                console.log(action.payload);
            })
    }
});

export const { filterPostsByUser } = PostSlice.actions;

export default PostSlice.reducer;
