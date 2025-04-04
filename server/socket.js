const { Server } = require("socket.io");
const { default: Message } = require("./src/models/message.model");

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


    const sendMessage = async (message) => {
        console.log(userSocketMap);
    
        const senderSocketId = userSocketMap.get(message.sender);
        const recipientSocketId = userSocketMap.get(message.recipient);
    
        console.log(
          `Sending message to ${recipientSocketId} from ${senderSocketId}`
        );
    
        const createdMessage = await Message.create(message);
    
        const messageData = await Message.findById(createdMessage._id)
          .populate("sender", "id email name username")
          .populate("recipient", "id email name username");
    
        if (recipientSocketId) {
          io.to(recipientSocketId).emit("receiveMessage", messageData);
        }
        if (senderSocketId) {
          io.to(senderSocketId).emit("receiveMessage", messageData);
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
        socket.on("sendMessage",sendMessage);
    });
}

module.exports = setupSocket;