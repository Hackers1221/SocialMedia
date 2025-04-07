import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../config/axiosInstance";

const initialState = {
    groups: []
};

export const createGroup = createAsyncThunk ('createGroup', async (data) => {
    try {
        const response = await axiosInstance.post (`group`, data, {
            headers: {
                'x-access-token': localStorage.getItem('token')
            }
        })
        return response;
    } catch (error) {
        console.log (error);
    }
})

export const getGroupByUserId = createAsyncThunk ('getGroupByUserId', async (id) => {
    try {
        const response = await axiosInstance.get (`/${id}`, {
            headers: {
                'x-access-token': localStorage.getItem('token')
            }
        })
        return response;
    } catch (error) {
        console.log (error);
    }
})


const GroupSlice = createSlice({
  name: "group",
  initialState,
  reducers: {},
  extraReducers : (builder) => {
      builder
      .addCase(createGroup.fulfilled,(state, action)=>{
          if (!action.payload.data?.groupData) return;
          state.groups = [...state.groups, action.payload.data?.groupData];
      })
  }
});

export default GroupSlice.reducer;
