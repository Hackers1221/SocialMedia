const { Server } = require("socket.io");

const setupSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: "http://localhost:5173",  // Change this to your frontend URL
            methods: ["GET", "POST"]
        }
    });

    const userSocketMap = new Map();

    const disconnect = (socket) => {
        console.log(`Client disconnected: ${socket.id}`);
        for (const [userId, socketId] of userSocketMap.entries()) {
        if (socketId === socket.id) {
            userSocketMap.delete(userId);
            break;
        }
        }
    };

    io.on("connection", (socket) => {
        console.log(`Socket ${socket.id} connected.`);
        const userId = socket.handshake.query.userId;

        if (userId) {
        userSocketMap.set(userId, socket.id);
        console.log(`User connected: ${userId} with socket id: ${socket.id}`);
        } else {
        console.log("User ID not provided during connection.");
        }

        socket.on("message", (data) => {
            console.log("Messege received: ", data);
            socket.emit("message", data);
        })
        socket.on("disconnect", () => disconnect(socket));

        socket.on("connect", () => {
            console.log(socket.connected); // true
          });
    });
}

module.exports = setupSocket;