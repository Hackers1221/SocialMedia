const { Server } = require("socket.io");
const Message = require ('../server/src/models/message.model');
const Group = require ('../server/src/models/group.model')
const { uploadFile } = require("./cloudConfig");

let onlineUsers = new Map ();

const setupSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: "http://localhost:5173", 
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
        onlineUsers.delete(socket.id);
        io.emit('online-users', Array.from(onlineUsers.values()));
    };


    const sendMessage = async (message) => {    
        const senderSocketId = userSocketMap.get(message.sender);
        const recipientSocketId = userSocketMap.get(message.recipient);
    
        console.log(
          `Sending message to ${recipientSocketId} from ${senderSocketId}`
        );

        const uploadedFiles = [];

        // Upload files to Cloudinary
        for (const file of message.files) {
          try {
            const uploadRes = await uploadFile(file);
            uploadedFiles.push({
              name: file.name,
              url: uploadRes.secure_url,
              filename: file.type,
            });
          } catch (err) {
            console.error("Cloudinary upload error:", err);
          }
        }
    
        const createdMessage = await Message.create({...message, files: uploadedFiles});
    
        const messageData = await Message.findById(createdMessage._id)
        .populate("sender", "id name image")
        .populate("recipient", "id name image");

    
        if (recipientSocketId) {
          io.to(recipientSocketId).emit("receiveMessage", messageData);
        }
        if (senderSocketId) {
          io.to(senderSocketId).emit("receiveMessage", messageData);
        }
    };

    const createGroup = async (data) => {
      const uploadRes = await uploadFile(data.image);
      const image = {
        name: data.image.name,
        url: uploadRes.secure_url,
        filename: data.image.type,
      };

      const groupData = await Group.create({
        name: data.name,
        admin: data.admin,
        members: data.members,
        image
      });
      
      groupData.members.forEach(memberId => {
        const socketId = userSocketMap.get(memberId);
        if (socketId) {
          io.to(socketId).emit('groupCreated', groupData);
        }
      });
    }

    io.on("connection", (socket) => {
        console.log(`Socket ${socket.id} connected.`);
        const userId = socket.handshake.query.userId;

        if (userId) {
        userSocketMap.set(userId, socket.id);
        console.log(`User connected: ${userId} with socket id: ${socket.id}`);
        } else {
        console.log("User ID not provided during connection.");
        }
        socket.on("disconnect", () => disconnect(socket));

        onlineUsers.set(socket.id, userId);
        console.log ('onlineUsers', onlineUsers)
        io.emit('online-users', Array.from(onlineUsers.values()));

        socket.on("sendMessage",sendMessage);
        socket.on ("create-group", createGroup);
    });

    
}

module.exports = setupSocket;