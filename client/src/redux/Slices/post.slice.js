import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../config/axiosInstance";
import { showToast } from "./toast.slice";

const initialState = {
    downloadedPosts: [],
    postList: [],
    savedList:[],
    relatedPosts: [],
    interestList: ""
};

export const getAllPosts = createAsyncThunk('posts/getAllPosts', async (_, { dispatch }) => {
    try {
        const response = await axiosInstance.get('post/posts', {
            headers: {
                'x-access-token': localStorage.getItem('token')
            }
        });

        return response;
    } catch (error) {
        dispatch (showToast ({ message: error.response.data.error || "Failed to fetch posts!", type: 'error' }));
    }
});

export const createPost = createAsyncThunk('post/createPost', async (postData, { dispatch, rejectWithValue }) => {
    try {
        const response = await axiosInstance.post('post/posts', postData, {
            headers: {
                'x-access-token': localStorage.getItem('token')
            }
        });

        dispatch (showToast ({ message: 'Post created successfully!', type: 'success' }));
        return response;
    } catch (error) {
        dispatch(showToast({ message: 'Post creation failed!', type: 'error' }));
        return rejectWithValue (error.response?.data?.error);
    }
});

export const updatePost = createAsyncThunk('post/updatePost',async(id,postdata, { dispatch }) => {
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
        dispatch (showToast ({ message: error.response.data.error || "Failed to update post!", type: 'error' }));
    }
})

export const likePost = createAsyncThunk('post/likePost', async(data, { dispatch }) => {
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
        dispatch (showToast ({ message: error.response.data.error || "Failed to update post!", type: 'error' }));
    }
})

export const getPostByUserId = createAsyncThunk('post/getpost' ,async(id, { dispatch }) => {
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
        dispatch (showToast ({ message: error.response.data.error || "Failed to get post!", type: 'error' }));
    }
})

export const getPostById = createAsyncThunk('post/getpostById' ,async(id, { dispatch }) => {
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
        dispatch (showToast ({ message: error.response.data.error || "Failed to get post!", type: 'error' }));
    }
})

export const getSavedPost = createAsyncThunk('post/getSavedPost' , async(id, { dispatch }) => {
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
        dispatch (showToast ({ message: error.response.data.error || "Failed to get saved posts!", type: 'error' }));
    }
})

export const updateSavedPost = createAsyncThunk('post/updatesavedPost', async (data, { dispatch }) => {
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
        dispatch (showToast ({ message: error.response.data.error || "Failed to update posts!", type: 'error' }));
    }
})

export const DeletePost = createAsyncThunk('post/delete' , async(data, { dispatch }) => {
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
        dispatch (showToast ({ message: error.response.data.error || "Failed to delete the post!", type: 'error' }));
    }
})

export const searchPost = createAsyncThunk('search.post',async(query, { dispatch }) => {
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
        dispatch (showToast ({ message: error.response.data.error || "Failed to search for post!", type: 'error' }));
    }
})

export const getExplorePost = createAsyncThunk('explorePost',async(id, { dispatch }) => {
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
        dispatch (showToast ({ message: error.response.data.error || "Failed to search for the post!", type: 'error' }));
    }
})

export const getRelatedPosts = createAsyncThunk('relatedPost',async (id, { dispatch }) => {
    try {
        const response = await axiosInstance.get(`post/relatedPost/${id}`,{
            headers: {
                'x-access-token': localStorage.getItem('token')
            },
        })
        if (response) return response;
    } catch (error) {
        dispatch (showToast ({ message: error.response.data.error || "Failed to get the posts!", type: 'error' }));
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
                const interestText = post.interests[0] || '';
                const matches = interestTags.some(tag => interestText.includes(tag));

                if (matches) matchingPosts.push(post);
                else nonMatchingPosts.push(post);
            }

            state.postList = [...matchingPosts, ...nonMatchingPosts];
        },
        clearRelatedPosts: (state) => {
            state.relatedPosts = [];
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
            .addCase (getRelatedPosts.fulfilled, (state, action) => {
                if (!action.payload.data) return;
                state.relatedPosts = action.payload.data.posts;
            })
    }
});

export const { filterPostsByUser, filterPostsByLiked, filterPostsByFollowing, filterPostByInterests, clearRelatedPosts } = PostSlice.actions;

export default PostSlice.reducer;
