import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axiosInstance from "../../config/axiosInstance"
import { showToast } from "./toast.slice"

const initialState = {
    comments : []
}

export const CreateComment = createAsyncThunk('post/comment' , async(data, { dispatch }) => {
    try {
        const response = await axiosInstance.post('comment', data, {
            headers: {
                'x-access-token': localStorage.getItem('token')
            }
        })
        return response;
    } catch (error) {
        dispatch (showToast ({ message: error.response.data.error || "An error occurred!", type: 'error' }));        
    }
})


export const getCommentByPostId = createAsyncThunk('get/comment',async(id, { dispatch }) => {
    try {
        const response = await axiosInstance.get(`comment/${id}`,{
            headers: {
                'x-access-token': localStorage.getItem('token')
            }
        })
        return response;
    } catch (error) {
        dispatch (showToast ({ message: error.response.data.error || "An error occurred!", type: 'error' }));
    }
})

export const getPulseComments = createAsyncThunk('get/allComments', async(_, { dispatch }) => {
    try {
        const response = await axiosInstance.get(`comment`,{
            headers: {
                'x-access-token': localStorage.getItem('token')
            }
        })
        return response;
    } catch (error) {
        dispatch (showToast ({ message: error.response.data.error || "An error occurred!", type: 'error' }));
    }
})

export const likeComment = createAsyncThunk('post/likeComment', async(data, { dispatch }) => {
    try {
        const resp = {
            id : data.id
        }
        const response = await axiosInstance.patch(`comment/like/${data._id}`,resp , {
            headers: {
                'x-access-token': localStorage.getItem('token')
            }
        })
        if(response){
            return response;
        }
    } catch (error) {
        dispatch (showToast ({ message: error.response.data.error || "An error occurred!", type: 'error' }));
    }
})

const commentSlice = createSlice({
    name : 'comment',
    initialState,
    reducers : {},
    extraReducers : (builder) => {
        builder
        .addCase(getCommentByPostId.fulfilled,(state,action)=>{
            state.comments = action.payload?.data?.commentDetails;
        })
        .addCase(getPulseComments.fulfilled,(state,action)=>{
            state.comments = action.payload?.data?.commentDetails;
        })
    }
})

export default commentSlice.reducer;
