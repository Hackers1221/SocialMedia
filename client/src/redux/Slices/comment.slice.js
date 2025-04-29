import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axiosInstance from "../../config/axiosInstance"


const initialState = {
    comments : []
}

export const CreateComment = createAsyncThunk('post/comment' , async(data) => {
    try {
        const response = await axiosInstance.post('comment', data, {
            headers: {
                'x-access-token': localStorage.getItem('token')
            }
        })
        return response;
    } catch (error) {
        console.log(error);
    }
})


export const getCommentByPostId = createAsyncThunk('get/comment',async(id) => {
    try {
        const response = await axiosInstance.get(`comment/${id}`,{
            headers: {
                'x-access-token': localStorage.getItem('token')
            }
        })
        return response;
    } catch (error) {
        console.log(error);
    }
})

export const getPulseComments = createAsyncThunk('get/allComments', async() => {
    try {
        const response = await axiosInstance.get(`comment`,{
            headers: {
                'x-access-token': localStorage.getItem('token')
            }
        })
        return response;
    } catch (error) {
        console.log(error);
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
            console.log (action.payload.data);
            state.comments = action.payload?.data?.commentDetails;
        })
    }
})

export default commentSlice.reducer;
