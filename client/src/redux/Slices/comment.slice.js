import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axiosInstance from "../../config/axiosInstance"


const initialState = {
    comments : []
}

export const CreateComment = createAsyncThunk('post/comment' , async(data) => {
    try {
        const response = await axiosInstance.post('comment',data , {
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
        
    }
})

export default commentSlice.reducer;
