import { createSlice } from "@reduxjs/toolkit";
import { io } from "socket.io-client";
import { updateMessages, setOnlineUsers } from "./chat.slice";
import { addNotification, updateFollowingList } from "./auth.slice";
import { updateGroupDetails, updateGroupMessages, addGroup } from "./group.slice";

// Use environment variable at the top
const BASE_URL = import.meta.env.VITE_BASE_URL;

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
        socketInstance = io(BASE_URL, {
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

        socketInstance.on("notification", (data) => {
          dispatch(addNotification(data));
        });

        socketInstance.on("follow-accepted", (userID) => {
          dispatch(updateFollowingList(userID));
        });

        socketInstance.on("groupCreated", (data) => {
          dispatch(addGroup({ groupData: data }));
        });

        socketInstance.on("receiveGroupMessage", (data) => {
          dispatch(updateGroupMessages({ message: data }));
        });

        socketInstance.on("updatedGroup", (data) => {
          dispatch(updateGroupDetails({ groupData: data.updated, groupDetails: data.group }));
        });

        socketInstance.on("group-leave", (data) => {
          dispatch(updateGroupDetails({ groupData: data.updated, groupDetails: data.group }));
        });

        socketInstance.on("group-delete", (data) => {
          dispatch(updateGroupDetails({ groupDetails: data.group }));
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
        socketInstance.off("notification");
        socketInstance.off("follow-accepted");
        socketInstance.off("groupCreated");
        socketInstance.off("updatedGroup");
        socketInstance.off("group-leave");
        socketInstance.off("group-delete");

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
