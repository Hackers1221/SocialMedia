import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../config/axiosInstance";
import toast from "react-hot-toast";

const initialState = {
    groupDetails: [],
    liveGroup: {}
};

export const getGroupByUserId = createAsyncThunk ('getGroupByUserId', async (id) => {
    try {
        const response = await axiosInstance.get (`/group/by-user/${id}`, {
            headers: {
                'x-access-token': localStorage.getItem('token')
            }
        })
        return response;
    } catch (error) {
        toast.error(error.response.data.error || "An error occurred!");
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
        toast.error(error.response.data.error || "An error occurred!");
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
        toast.error(error.response.data.error || "An error occurred!");
    }
})


const GroupSlice = createSlice({
  name: "group",
  initialState,
  reducers: {
    addGroup: (state, action) => {
        if (state.groupDetails.length === 0) {
            state.groupDetails = [action.payload.groupData];
        } else {
            state.groupDetails = [action.payload.groupData, ...state.groupDetails];
        }
    },
    updateGroupMessages: (state, action) => {
        if (state.liveGroup._id === action.payload.message.groupId) state.liveGroup.messages = [...state.liveGroup.messages, action.payload.message];

        state.groupDetails = JSON.parse(JSON.stringify(
            state.groupDetails.map(group =>
              group.groupId === action.payload.message.groupId
                ? {
                    ...group,
                    _id: action.payload.message._id,
                    content: action.payload.message.content,
                    messageType: action.payload.message.messageType
                  }
                : group
            )
        ));    
    },
    updateGroupDetails: (state, action) => {
        if (!action.payload.groupData) state.liveGroup = {};
        else if (state.liveGroup._id === action.payload.groupData.group._id) {
            state.liveGroup = JSON.parse(JSON.stringify({
                ...state.liveGroup,
                image: action.payload.groupDetails.image,
                name: action.payload.groupDetails.name,
                members: action.payload.groupDetails.members,
                admins: action.payload.groupDetails.admins
            }));
        }
        
        if (action.payload.groupData) {
            let flag = 0;
            state.groupDetails.forEach ((group) => {
                if (group.groupId === action.payload.groupData.groupId) flag = 1;
            })

            state.groupDetails = JSON.parse(JSON.stringify(
                state.groupDetails.map(group =>
                    group.groupId === action.payload.groupData.groupId
                        ? action.payload.groupData
                        : group
                )
            ));

            if (!flag) {
                state.groupDetails = [action.payload.groupData, ...state.groupDetails];
            }
        }
        else {
            state.groupDetails = state.groupDetails.filter(
                group => group.groupId !== action.payload.groupDetails._id
            );
        }
        
    }
  },
  extraReducers : (builder) => {
      builder
      .addCase(getGroupById.fulfilled, (state, action) => {
        if (!action.payload.data?.groupData) return;
        state.liveGroup = action.payload.data?.groupData;
    })
    .addCase(getRecentMessage.fulfilled,(state,action) => {
        state.groupDetails = action.payload?.data?.recentChats
    })
  }
});

export const { addGroup, updateGroupMessages, updateGroupDetails } = GroupSlice.actions;

export default GroupSlice.reducer;
