import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axiosInstance from "../../config/axiosInstance"
import toast from "react-hot-toast"


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
        toast.error(error.response.data.error || "An error occurred!");        
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
        toast.error(error.response.data.error || "An error occurred!");
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
        toast.error(error.response.data.error || "An error occurred!");
    }
})

export const likeComment = createAsyncThunk('post/likeComment', async(data) => {
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
        toast.error(error.response.data.error || "An error occurred!");
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
