import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  messages: [],
  users: [],
};

export const getMessages = createAsyncThunk ('getMessage', async (data) => {
  try {
    const response = await axiosInstance.get (`message`, {
      params: {
        sender: data.sender,
        receiver: data.receiver,
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
  reducers: {},
  extraReducers : (builder) => {
      builder
      .addCase(getMessages.fulfilled,(state, action)=>{
          console.log (action.payload);
      })
  }
});

export const { addMessage, updateUsers } = ChatSlice.actions;
export default ChatSlice.reducer;
