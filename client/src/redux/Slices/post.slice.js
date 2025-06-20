import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../config/axiosInstance";
import toast from "react-hot-toast";

const initialState = {
    downloadedPosts: [],
    postList: [],
    savedList:[],
    interestList: ""
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
        toast.error(error.response?.data?.error || "Failed to fetch posts");
    }
});

export const createPost = createAsyncThunk('post/createPost', async (postData) => {
    try {
        const response = await axiosInstance.post('post/posts', postData, {
            headers: {
                'x-access-token': localStorage.getItem('token')
            }
        });
        return response;
    } catch (error) {
        toast.error(error.response?.data?.error || "Failed to create post");
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
        toast.error(error.response?.data?.error || "Failed to update post");
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
        toast.error(error.response?.data?.error || "Failed to update post");
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
        toast.error(error.response?.data?.error || "Failed to get post");
    }
})

export const getPostById = createAsyncThunk('post/getpostnyId' ,async(id) => {
    try {
        const response = await axiosInstance.get(`post/${id}`, { 
            headers: {
                'x-access-token': localStorage.getItem('token')
            }
        })
        if(response){
            return response;
        }
    } catch (error) {
        toast.error(error.response?.data?.error || "Failed to get post");
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
        toast.error(error.response?.data?.error || "Failed to save post");
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
        toast.error(error.response?.data?.error || "Failed to update post");
    }
})

export const DeletePost = createAsyncThunk('post/delete' , async(data) => {
    try {        
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
        toast.error(error.response?.data?.error || "Could not delete the post");
    }
})

export const searchPost = createAsyncThunk('search.post',async(query) => {
    try {
        const response = await axiosInstance.get(`post/search/${query}`,{
            headers: {
                'x-access-token': localStorage.getItem('token')
            },
        })
        if(response){
            return response;
        }
    } catch (error) {
        toast.error(error.response?.data?.error || "Could not search for the post");
    }
})

export const getExplorePost = createAsyncThunk('explorePost',async(id) => {
    try {
        const response = await axiosInstance.get(`post/explorePosts/${id}`,{
            headers: {
                'x-access-token': localStorage.getItem('token')
            },
        })
        if(response){
            return response;
        }
    } catch (error) {
        toast.error(error.response?.data?.error || "Could not search for the post");
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
        filterPostsByLiked: (state, action) => {
            const id = action.payload?.id;
            state.postList = JSON.parse(JSON.stringify(state.downloadedPosts)).filter((post) => post.likes?.includes (id));
            state.postList = JSON.parse(JSON.stringify(state.postList));
        },
        filterPostsByFollowing: (state, action) => {
            const following = action.payload?.following;
            state.postList = JSON.parse(JSON.stringify(state.downloadedPosts)).filter((post) => following.includes(post.userId));
            state.postList = JSON.parse(JSON.stringify(state.postList));
        },
        filterPostByInterests: (state) => {
            const interestTags = state.interestList.split(' ');

            const allPosts = JSON.parse(JSON.stringify(state.downloadedPosts));

            const matchingPosts = [];
            const nonMatchingPosts = [];

            for (const post of allPosts) {
                const interestText = post.interests?.[0] || '';
                const matches = interestTags.some(tag => interestText.includes(tag));

                if (matches) matchingPosts.push(post);
                else nonMatchingPosts.push(post);
            }

            state.postList = [...matchingPosts, ...nonMatchingPosts];
        }
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
                state.downloadedPosts = [action.payload?.data?.postsdata?.post, ...state.downloadedPosts];
            })
            .addCase(getPostByUserId.fulfilled , (state,action) => {
                if(!action.payload?.data)return; 
                state.postList = action.payload?.data?.postDetails.reverse();
            })
            .addCase(getSavedPost.fulfilled,(state,action) => {
                if(!action.payload?.data) return; 
                state.savedList = action.payload?.data?.postDetails.reverse();
            })
            .addCase(getExplorePost.fulfilled,(state,action) => {
                if(!action.payload?.data) return; 
                state.interestList = action.payload.data?.interests;
            })
            .addCase (getPostById.fulfilled, (state, action) => {
                if (!action.payload?.data) return;
                const idx = state.downloadedPosts.findIndex(
                    (post) => post._id === action.payload.data.postDetails._id
                );
            
                if (idx !== -1) {
                    state.downloadedPosts[idx] = action.payload.data.postDetails;
                }

                const index = state.postList.findIndex(
                    (post) => post._id === action.payload.data.postDetails._id
                );
            
                if (index !== -1) {
                    state.postList[index] = action.payload.data.postDetails;
                }
            })
    }
});

export const { filterPostsByUser, filterPostsByLiked, filterPostsByFollowing, filterPostByInterests } = PostSlice.actions;

export default PostSlice.reducer;
