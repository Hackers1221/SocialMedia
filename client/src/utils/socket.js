import { io } from "socket.io-client";
const SOCKET_URL = import.meta.env.VITE_BASE_UR

export const socket = io( SOCKET_URL, { autoConnect: false });
