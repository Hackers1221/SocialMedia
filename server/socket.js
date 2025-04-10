const { Server } = require("socket.io");
const Message = require ('../server/src/models/message.model');
const Group = require ('../server/src/models/group.model')
const { uploadFile } = require("./cloudConfig");
const { default: mongoose } = require("mongoose");
const User = require("../server/src/models/user.model");

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

    const sendGroupMessage = async (message) => {    
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

      const recipient = message.recipient.map(user => user.userId);

      const createdMessage = await Message.create({
        groupId: message.groupId,
        sender: message.sender,
        recipient,
        content: message.content,
        files: uploadedFiles
      });
  
      const messageData = await Message.findById(createdMessage._id)
      .populate("sender", "id name image");

      for (const member of messageData.recipient) {
        const socketId = userSocketMap.get(member._id.toString());
        if (socketId) {
          io.to(socketId).emit("receiveGroupMessage", messageData);
        }
      }
  };

    const createGroup = async (data) => {
      let uploadRes, image;

      if (data.image) {
        uploadRes = await uploadFile(data.image);
        image = {
          name: data.image.name,
          url: uploadRes.secure_url,
          filename: data.image.type,
        };
      }

      const members = [];

      data.members.forEach(member => {
        try {
          const userId = new mongoose.Types.ObjectId(member.id);
          const addedBy = new mongoose.Types.ObjectId(member.addedBy);
          members.push({ userId, addedBy });
        } catch (err) {
          console.warn('Invalid ObjectId:', member, err.message);
        }
      });

      const admin = new mongoose.Types.ObjectId(data.admin[0]);
      

      try {
        const groupData = await Group.create({
          name: data.name,
          admins: [admin],
          members,
          image
        });

        const adminDetails = await User.findById(data.admin[0]);
  
        const messageData = await Message.create({
           content : `${adminDetails.username} created the group`,
           messageType : true,
           groupId: groupData._id
        });

        let msg = {};

        for (const member of groupData.members) {
          const userDetails = await User.findById(member.userId);
          if (adminDetails.username !== userDetails.username) {
            msg = await Message.create({
              content: `${adminDetails.username} added ${userDetails.username}`,
              messageType: true,
              groupId: groupData._id
            });
          }
        }

        const uploadData = {
          _id: msg._id,
          content: msg.content,
          groupId: groupData._id,
          messageType: true,
          group: {
            image: groupData.image,
            _id: groupData._id,
            name: groupData.name
          }
        }

        groupData.members.forEach(member => {
          console.log (member.userId.toString());
          const socketId = userSocketMap.get(member.userId.toString());
          if (socketId) {
            io.to(socketId).emit('groupCreated', uploadData);
          }
        });

      } catch (error) {
        console.log (error);
      }
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
        console.log ('onlineUsers', onlineUsers);
        io.emit('online-users', Array.from(onlineUsers.values()));

        socket.on("sendMessage",sendMessage);
        socket.on ("create-group", createGroup);
        socket.on ("sendGroupMessage", sendGroupMessage);
    });

    
}

module.exports = setupSocket;