import { useDispatch, useSelector } from "react-redux";
import { io } from "socket.io-client";
import { useEffect, useState } from "react";
import { setOnlineUsers, updateMessages } from "../redux/Slices/chat.slice";

const useSocket = () => {
    const authState = useSelector((state) => state.auth);
    const [socket, setSocket] = useState(null);

    const dispatch = useDispatch ();

    useEffect(() => {
        if (!authState?.data?._id) return;  // Wait until user data is available

        const newSocket = io ("http://localhost:8080", {
            autoConnect: false,
            transports: ["websocket"],
            query: {
                userId: authState.data._id,
            },
        });

        newSocket.connect();  // Explicitly connect
        setSocket(newSocket);

        newSocket.on("connect", () => console.log("Connected:", newSocket.id));
        newSocket.on("disconnect", () => console.log("Disconnected"));

        newSocket.on("receiveMessage", async (data) => {
            console.log ('data');
            await dispatch (updateMessages ({ message: data }));
        });

        newSocket.on ('online-users', async (data) => {
            console.log ('Online Users Updates', data);
            await dispatch (setOnlineUsers ({onlineUsers: data}));
        })

        return () => {
            newSocket.disconnect();
            newSocket.off('online-users');
        };
    }, [authState?.data?._id]);

    return socket;
};

export default useSocket;
