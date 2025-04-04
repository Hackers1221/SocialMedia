import { useSelector } from "react-redux";
import { io } from "socket.io-client";

const authState = useSelector ((state) => state.auth);

export const socket = io('http://localhost:8080', 
    { 
        autoConnect: false, 
        transports: ["websocket"],
        query: {
            userId: authState.data?._id
        }
     }
);
