const { Server } = require("socket.io");
const Message = require ('../server/src/models/message.model');
const Group = require ('../server/src/models/group.model')
const { uploadFile } = require("./cloudConfig");
const { default: mongoose } = require("mongoose");
const User = require("../server/src/models/user.model");
const { date } = require("joi");

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
  
        for (const member of groupData.members) {
          const userDetails = await User.findById(member.userId);
          if (adminDetails.username !== userDetails.username) {
            await Message.create({
              content: `${adminDetails.username} added ${userDetails.username}`,
              messageType: true,
              groupId: groupData._id
            });
          }
        }

        groupData.members.forEach(memberId => {
          const socketId = userSocketMap.get(memberId);
          if (socketId) {
            io.to(socketId).emit('groupCreated', groupData);
          }
        });

      } catch (error) {
        console.log (error);
      }
    }

    const updateGroupDetails = async (data) => {
      let uploadRes, image;
   

      const previousGroupDetails = await Group.findById(data._id);

      image = previousGroupDetails?.image;

      if (data.image) {
        deleteRes  =await deleteImages([previousGroupDetails.image?.filename]);
        uploadRes = await uploadFile(data.image);
        image = {
          name: data.image.name,
          url: uploadRes.secure_url,
          filename: data.image.type,
        };
      }

      const members = [];
      const admins = [];

      data.members?.forEach(member => {
        try {
          const userId = new mongoose.Types.ObjectId(member.id);
          const addedBy = new mongoose.Types.ObjectId(member.addedBy);
          members.push({ userId, addedBy });
        } catch (err) {
          console.warn('Invalid ObjectId:', member, err.message);
        }
      });
      
      data.admins?.forEach(admins => {
        try {
          const admin = new mongoose.Types.ObjectId(admins);
          admins.push(admin);
        } catch (err) {
          console.warn('Invalid ObjectId:', admins, err.message);
        }
      });
      

      try {
        const updateData = {
          $push: {
            members: { $each: members },
            admins: { $each: admins }
          }
        };
        if (data.name) {
          updateData.name = data.name;
        }
        if (data.image) {
          updateData.image = data.image;
        }
        
        const groupData = await Group.findByIdAndUpdate(
          data._id,
          updateData,
          { new: true }
        );

        const adminDetails = await User.findById(data.admin);

        if(data.name){
          const updatedNameMessage = await Message.create({
            content : `${adminDetails.username} changed the group name to ${data.name}`,
            groupId : data._id,
            messageType : true,
          });
          groupData.members.forEach(memberId => {
            const socketId = userSocketMap.get(memberId);
            if (socketId) {
              io.to(socketId).emit('receiveGroupMessage', updatedNameMessage);
            }
          });
        }

        if(data.image){
          const updatedImageMessage = await Message.create({
            content : `${adminDetails.username} updated the group icon`,
            groupId : data._id,
            messageType : true,
          });
          groupData.members.forEach(memberId => {
            const socketId = userSocketMap.get(memberId);
            if (socketId) {
              io.to(socketId).emit('receiveGroupMessage', updatedImageMessage);
            }
          });

        }

        if (data.members && data.members.length > 0) {
          for (const member of data.members) {
            const userDetails = await User.findById(member);
            const updatedMemberMessage = await Message.create({
              content: `${adminDetails.username} added ${userDetails.username}`,
              groupId: data._id,
              messageType: true,
            });
            const socketId = userSocketMap.get(member);
            if (socketId) {
              io.to(socketId).emit('receiveGroupMessage', updatedMemberMessage);
            }
          }
        }
        
        groupData.members.forEach(memberId => {
          const socketId = userSocketMap.get(memberId);
          if (socketId) {
            io.to(socketId).emit('updatedGroup', groupData);
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
        socket.on ("update-group", updateGroupDetails);
    });

    
}

module.exports = setupSocket;