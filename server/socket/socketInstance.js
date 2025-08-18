let io;
const userSocketMap = new Map();
let onlineUsers = new Map();


const setIO = (ioInstance) => {
    io = ioInstance;
};

const getIO = () => {
    if (!io) {
        throw new Error("Socket.io instance not initialized!");
    }
    return io;
};

module.exports = { setIO, getIO, userSocketMap, onlineUsers };
