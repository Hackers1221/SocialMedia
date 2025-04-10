import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../config/axiosInstance";

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
    addGroup: (state, action) => {
        if (state.groupDetails.length === 0) {
            state.groupDetails = [action.payload.groupData];
        } else {
            state.groupDetails = [action.payload.groupData, ...state.groupDetails];
        }
    },
    updateGroupMessages: (state, action) => {
        if (state.liveGroup.messages) state.liveGroup.messages = [...state.liveGroup.messages, action.payload.message];

        if (!state.groupDetails) {
            state.groupDetails
        }

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
        if (state.liveGroup) {
            state.liveGroup = JSON.parse(JSON.stringify({
                ...state.liveGroup,
                image: action.payload.groupData.group?.image || action.payload.groupData.image,
                name: action.payload.groupData.group?.name || action.payload.groupData.name,
                members: state.liveGroup.members || action.payload.groupData.members
            }));
        }
        
        state.groupDetails = JSON.parse(JSON.stringify(
            state.groupDetails.map(group =>
                group.groupId === action.payload.groupData.groupId
                    ? action.payload.groupData
                    : group
            )
        ));
        
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
