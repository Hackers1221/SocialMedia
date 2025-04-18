import { createSlice } from "@reduxjs/toolkit";
import { io } from "socket.io-client";
import { updateMessages, setOnlineUsers } from "./chat.slice";
import { updateGroupDetails, updateGroupMessages } from "./group.slice";
import { addGroup } from "./group.slice";


let socketInstance = null;

const initialState = {
  socket: null,
  connected: false,
};

const socketSlice = createSlice({
  name: "socket",
  initialState, 
  reducers: {
    initSocket: (state, action) => {
      const { userId, dispatch } = action.payload;

      if (!socketInstance) {
        socketInstance = io("http://localhost:8080", {
          transports: ["websocket"],
          autoConnect: false,
          query: { userId },
        });

        socketInstance.connect();

        // Global listeners
        socketInstance.on("connect", () => {
          console.log("Socket connected");
          dispatch(setConnected(true));
        });

        socketInstance.on("disconnect", () => {
          console.log("Socket disconnected");
          dispatch(setConnected(false));
        });

        socketInstance.on("receiveMessage", (data) => {
          dispatch(updateMessages({ message: data }));
        });

        socketInstance.on("online-users", (data) => {
          dispatch(setOnlineUsers({ onlineUsers: data }));
        });

        socketInstance.on("groupCreated", (data) => {
          dispatch(addGroup ({ groupData: data }));
        })

        socketInstance.on("receiveGroupMessage", (data) => {
          dispatch(updateGroupMessages({ message: data }));
        });

        socketInstance.on("updatedGroup", (data) => {
          console.log (data);
          dispatch(updateGroupDetails ({ groupData: data.updated, groupDetails: data.group }));
        });

        socketInstance.on("group-leave", (data) => {
          dispatch(updateGroupDetails ({ groupData: data.updated, groupDetails: data.group }));
        });
      }

      state.socket = socketInstance;
    },

    disconnectSocket: (state) => {
      if (socketInstance) {
        socketInstance.off("connect");
        socketInstance.off("disconnect");
        socketInstance.off("receiveMessage");
        socketInstance.off("receiveGroupMessage");
        socketInstance.off("online-users");
        socketInstance.off("groupCreated");
        socketInstance.off("updatedGroup");
        socketInstance.off("group-leave");

        socketInstance.disconnect();
        socketInstance = null;
        state.socket = null;
        state.connected = false;
      }
    },

    setConnected: (state, action) => {
      state.connected = action.payload;
    },
  },
});

export const { initSocket, disconnectSocket, setConnected } = socketSlice.actions;
export default socketSlice.reducer;
