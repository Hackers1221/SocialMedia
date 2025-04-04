import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  messages: [],
  users: [],
};

const ChatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
    updateUsers: (state, action) => {
      state.users = action.payload;
    },
  },
});

export const { addMessage, updateUsers } = ChatSlice.actions;
export default ChatSlice.reducer;
