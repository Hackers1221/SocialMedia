import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../config/axiosInstance";

const initialState = {
  messages: [],
  users: [],
  recipient: {}
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
    console.log (error)
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
    }
  },
  extraReducers : (builder) => {
      builder
      .addCase(getMessages.fulfilled,(state, action)=>{
          if (!action.payload?.data) return;
          state.messages = action.payload?.data?.messages;
          state.messages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
      })
  }
});

export const { setRecipient, updateMessages } = ChatSlice.actions;
export default ChatSlice.reducer;
