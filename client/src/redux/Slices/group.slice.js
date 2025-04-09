import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../config/axiosInstance";

const initialState = {
    groupDetails: [],
    liveGroup: {},
    recentChats : [],
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
        const response = await axiosInstance.get (`/group/by-user/${id}`, {
            headers: {
                'x-access-token': localStorage.getItem('token')
            }
        })
        return response;
    } catch (error) {
        console.log (error);
    }
})

export const getGroupById = createAsyncThunk ('getGroupById', async (id) => {
    try {
        const response = await axiosInstance.get (`/group/by-id/${id}`, {
            headers: {
                'x-access-token': localStorage.getItem('token')
            }
        })
        return response;
    } catch (error) {
        console.log (error);
    }
})

export const getRecentMessage = createAsyncThunk('getrecentGroupChats' , async(id) => {
    try {
        const response = await axiosInstance.get(`/group/recent/${id}` , {
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
  reducers: {
    addGroup : (state, action) => {
        state.groupDetails = [action.payload.groupData, ...state.groups];
    },
    updateGroupMessages : (state, action) => {
        state.liveGroup.messages = [...state.liveGroup.messages, action.payload.message];
    }
  },
  extraReducers : (builder) => {
      builder
      .addCase(createGroup.fulfilled,(state, action)=>{
          if (!action.payload.data?.groupData) return;
          state.groups = [...state.groups, action.payload.data?.groupData];
      })
      .addCase(getGroupByUserId.fulfilled, (state, action) => {
          if (!action.payload.data?.groupData) return;
          state.groups = action.payload.data?.groupData;
      })
      .addCase(getGroupById.fulfilled, (state, action) => {
        if (!action.payload.data?.groupData) return;
        state.liveGroup = action.payload.data?.groupData;
    })
    .addCase(getRecentMessage.fulfilled,(state,action) => {
        state.groupDetails = action.payload?.data?.recentChats
    })
  }
});

export const { addGroup, updateGroupMessages } = GroupSlice.actions;

export default GroupSlice.reducer;
