import { useSelector } from "react-redux";
import { io } from "socket.io-client";
import { useEffect, useState } from "react";

const useSocket = () => {
    const authState = useSelector((state) => state.auth);
    const [socket, setSocket] = useState(null);

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

        return () => {
            newSocket.disconnect();
        };
    }, [authState?.data?._id]);

    return socket;
};

export default useSocket;
