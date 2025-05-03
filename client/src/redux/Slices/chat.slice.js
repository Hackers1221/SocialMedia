import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../config/axiosInstance";
import toast from "react-hot-toast";

const initialState = {
  messages: [],
  users: [],
  recipient: {},
  onlineUsers: [],
  recentMessages: []
};

export const getMessages = createAsyncThunk ('getMessage', async (data) => {
  try {
    const response = await axiosInstance.get (`message`, {
      params: {
        sender: data.sender,
        recipient: data.recipient,
      }, 
      headers: {
        'x-access-token': localStorage.getItem('token')
      }
    })
    return response;
  } catch (error) {
    toast.error(error.response.data.error || "An error occurred!");
  }
})

export const getRecentMessages = createAsyncThunk ('getRecentMessage', async (id) => {
  try {
    const response = await axiosInstance.get (`message/${id}`, {
      headers: {
        'x-access-token': localStorage.getItem('token')
      }})
      return response;
  } catch (error) {
    toast.error(error.response.data.error || "An error occurred!");
  }
})

const ChatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setRecipient: (state, action) => {
      const user = action.payload?.userDetails;
      state.recipient = user;
    },
    updateMessages: (state, action) => {
      state.messages = [...state.messages, action.payload.message];
    },
    setOnlineUsers: (state, action) => {
      const users = action.payload?.onlineUsers;
      state.onlineUsers = users;
    }
  },
  extraReducers : (builder) => {
      builder
      .addCase(getMessages.fulfilled,(state, action)=>{
          if (!action.payload?.data) return;
          state.messages = action.payload?.data?.messages;
          state.messages.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      })
      .addCase (getRecentMessages.fulfilled, (state, action) => {
        if (!action.payload?.data) return;
        state.recentMessages = action.payload?.data?.messages;
        state.recentMessages.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      })
  }
});

export const { setRecipient, updateMessages, setOnlineUsers } = ChatSlice.actions;
export default ChatSlice.reducer;
