const { Server } = require("socket.io");
const Message = require('../src/models/message.model');
const Group = require('../src/models/group.model');
const User = require("../src/models/user.model");
const { uploadFile, deleteImages } = require("../cloudConfig");
const mongoose = require("mongoose");
const { FRONT_URL } = require('../src/config/db.config');

const { setIO, userSocketMap, onlineUsers } = require("./socketInstance"); // To set io globally

const setupSocket = (server) => {
  const io = new Server (server, {
    cors: {
      origin: FRONT_URL,
      methods: ["GET", "POST", "DELETE", "PUT"],
    },
  });

  setIO(io); // Make io globally accessible

  // Handle disconnection
  const disconnect = (socket) => {
    console.log(`Client disconnected: ${socket.id}`);
    for (const [userId, socketId] of userSocketMap.entries()) {
      if (socketId === socket.id) {
        userSocketMap.delete(userId);
        break;
      }
    }
    onlineUsers.delete(socket.id);
    io.emit("online-users", Array.from(onlineUsers.values()));
  };

  const sendMessage = async (message) => {
    const senderSocketId = userSocketMap.get(message.sender);
    const recipientSocketId = userSocketMap.get(message.recipient);
    
    const uploadedFiles = [];

  
    // Upload files to Cloudinary
    for (const file of message?.files) {
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
  
    // 1. Get the latest personal message between sender and recipient, excluding group messages
    const latestMessage = await Message.findOne({
      $or: [
        { sender: message.sender, recipient: message.recipient, groupId : ""},
        { sender: message.recipient, recipient: message.sender, groupId : ""}
      ]
    }).sort({ createdAt: -1 });
  
    // 2. Check if date separator is needed (before creating the main message)
    const nowDate = new Date().toISOString().slice(0, 10);
    const latestDate = latestMessage?.createdAt?.toISOString().slice(0, 10);
  
    // Check if date separator is required
    if (!latestMessage || nowDate !== latestDate) {
      const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
      ];
  
      const now = new Date();
      const formattedDate = `${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`;
  
      // Create date message (only if it hasn't been created for today)
      const dateMessage = await Message.create({
        sender: message.sender,
        recipient: message.recipient,
        content: formattedDate,
        files: [],
        targetType: "message",
        messageType: true
      });
  
      // Send date message to both sender and recipient
      if (recipientSocketId) {
        io.to(recipientSocketId).emit("receiveMessage", dateMessage);
      }
      if (senderSocketId) {
        io.to(senderSocketId).emit("receiveMessage", dateMessage);
      }
    }

    if (message.targetType !== "message") {
        const parts = message.content.filename?.split('.') || message.content.image[0]?.filename?.split('.') || message.content.video[0]?.filename?.split('.');
        const extension = parts.pop();
        const base = parts.join('.');

        const url = typeof message.content.video === 'string'
        ? message.content.video
        : message.content.image?.[0]?.url || message.content.video?.[0]?.url;

        if (url) {
            uploadedFiles.push({
                name: message.content.caption || "File",
                url: url,
                filename: `${base}/${extension}`,
            });
        }

        message.content = "";
    }
  
    // 3. Create the actual message
    const createdMessage = await Message.create({
        sender: message.sender,
        recipient: message.recipient,
        targetType: message.targetType,
        postId: message.postId,
        content: message.content,
        messageType: false,
        files: uploadedFiles
    });
  
    const messageData = await Message.findById(createdMessage._id)
      .populate("sender", "id name image")
      .populate("recipient", "id name image");
  
    // Send the actual message to both sender and recipient
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
    for (const file of message?.files) {
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

  
    // Get the recipient user IDs
    const recipient = message.recipient.map(user => user.userId._id);

  
    // 3. Create the actual message
    const createdMessage = await Message.create({
      groupId: message.groupId,
      sender: message.sender,
      recipient,
      content: message.content,
      files: uploadedFiles,
      postId: message.postId,
      targetType: message.targetType,
      messageType: message.messageType,
    });
  
    // Populate sender and recipient details for the new message
    const messageData = await Message.findById(createdMessage._id)
      .populate("sender", "id name image");
  
    // Emit the message to the group members
    for (const member of recipient) {
      const socketId = userSocketMap.get(member.toString());
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
          members.push({ userId, addedBy, isActive: true });
        } catch (err) {
          console.warn('Invalid ObjectId:', member, err.message);
        }
      });

      const admin = new mongoose.Types.ObjectId(data.admin[0]);
      

      try {
        const groupData = await Group.create({
          name: data.name,
          creator: data.creator,
          admins: [admin],
          members,
          image
        });

        const adminDetails = await User.findById(data.admin[0]);
  
        const messageData = await Message.create({
           content : `${adminDetails.username} created the group`,
           messageType : true,
           groupId: groupData._id,
           targetType: "message"
        });

        let msg = {};

        for (const member of groupData.members) {
          const userDetails = await User.findById(member.userId);
          if (adminDetails.username !== userDetails.username) {
            msg = await Message.create({
              content: `${adminDetails.username} added ${userDetails.username}`,
              messageType: true,
              groupId: groupData._id,
                targetType: "message"
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
          const socketId = userSocketMap.get(member.userId.toString());
          if (socketId) {
            io.to(socketId).emit('groupCreated', uploadData);
          }
        });

      } catch (error) {
        console.log (error);
      }
    }

    const updateGroupDetails = async (data) => {
      try {
      let uploadRes, image;
   
      const previousGroupDetails = await Group.findById(data._id);

      image = previousGroupDetails?.image;

      if (data.image) {
        deleteRes = await deleteImages([previousGroupDetails.image?.filename]);
        uploadRes = await uploadFile(data.image);
        image = {
          name: data.image.name,
          url: uploadRes.secure_url,
          filename: data.image.type,
        };
      }

      const members = [];

      data.members?.forEach(member => {
        try {
          const userId = new mongoose.Types.ObjectId(member.id);
          const addedBy = new mongoose.Types.ObjectId(member.addedBy);
          members.push({ userId, addedBy, isActive: true });
        } catch (err) {
          console.warn('Invalid ObjectId:', member, err.message);
        }
      });

      const updateData = {};
      if (data.name) {
        updateData.name = data.name;
      }
      if (data.image) {
        updateData.image = image;
      }
      
      const updateQuery = { ...updateData };
      
      // Assuming `newAdmins` is an array and to push all its elements to the `admins` array
      if (data.admin) {
        await Group.findByIdAndUpdate(
          data._id,
          { $push: { admins: data.newAdmin } },
          { new: true }
        );     
      }
      
      let groupData = await Group.findByIdAndUpdate(
        data._id,
        updateQuery,
        { new: true }
      );      

        const existingMemberIds = groupData?.members.map(m => m.userId.toString());

        const existingMembers = members.filter(m => existingMemberIds.includes(m.userId.toString()));
        const newMembers = members.filter(m => !existingMemberIds.includes(m.userId.toString()));

        // Step 2: Update isActive = true for already present members
        if (existingMembers.length > 0) {
          await Group.updateOne(
            { _id: data._id },
            {
              $set: {
                "members.$[member].isActive": true
              }
            },
            {
              arrayFilters: [
                { "member.userId": { $in: existingMembers.map(m => m.userId) } }
              ]
            }
          );
        }

        // Step 3: Push new members
        if (newMembers.length > 0) {
          await Group.updateOne(
            { _id: data._id },
            {
              $push: {
                members: { $each: newMembers }
              }
            }
          );
        }

        const groupDetails = await Group.findById (groupData._id).populate("members.userId" , "image name username");

        const adminDetails = await User.findById(data.admin);

        let msg;

        if(data.name && data?.name !== previousGroupDetails?.name){
          const updatedNameMessage = await Message.create({
            content : `${adminDetails.username} changed the group name to ${data.name}`,
            groupId : data._id,
            messageType : true,
          });

          msg = updatedNameMessage;

          groupDetails.members.forEach(member => {
            const socketId = userSocketMap.get(member.userId.toString());
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
          msg = updatedImageMessage;
          groupDetails.members.forEach(member => {
            const socketId = userSocketMap.get(member.userId._id.toString());
            if (socketId) {
              io.to(socketId).emit('receiveGroupMessage', updatedImageMessage);
            }
          });
        }

        if (data.members?.length > 0) {
          let message = [];
          for (const member of data.members) {
            const userDetails = await User.findById(member.id);
            const updatedMemberMessage = await Message.create({
              content: `${adminDetails.username} added ${userDetails.username}`,
              groupId: data._id,
              messageType: true,
            });
            msg = updatedMemberMessage;

            message = [...message, updatedMemberMessage];
          }

          message.forEach ((msg) => {
            groupDetails.members.forEach(member => {
              const socketId = userSocketMap.get(member.userId._id.toString());
              if (socketId) {
                io.to(socketId).emit('receiveGroupMessage', msg);
              }
            });
          })
        }

        if (data.newAdmin) {
          const userDetails = await User.findById(data.newAdmin);
            const updatedMemberMessage = await Message.create({
              content: `${adminDetails.username} made ${userDetails.username} the group admin`,
              groupId: data._id,
              messageType: true,
            });
            msg = updatedMemberMessage;

            groupDetails.members.forEach(member => {
              const socketId = userSocketMap.get(member.userId._id.toString());
              if (socketId) {
                io.to(socketId).emit('receiveGroupMessage', msg);
              }
            });
        }

        const uploadData = {
          _id: msg._id,
          content: msg.content,
          groupId: groupDetails._id,
          messageType: true,
          group: {
            image: groupDetails.image,
            _id: groupDetails._id,
            name: groupDetails.name
          }
        }

        groupDetails.members.forEach(member => {
          const socketId = userSocketMap.get(member.userId._id.toString());
          if (socketId) {
            io.to(socketId).emit('updatedGroup', {updated: uploadData, group: groupDetails});
          }
        });

      } catch (error) {
        console.log (error);
      }
    }

    const leaveGroup = async (data) => {
      const previousGroupDetails = await Group.findById(data._id);
      const updatedGroupDetails = await Group.findOneAndUpdate(
        { _id: data._id, "members.userId": new mongoose.Types.ObjectId(data.userId) },
        {
          $set: {
            "members.$.isActive": false // or true, depending on your need
          }
        },
        { new: true }
      );

      const latestDetails = await Group.updateOne(
        { _id: data._id },
        { $pull: { admins: new mongoose.Types.ObjectId(data.userId) } }
      );
      

      const userDetails =  await User.findById(data.userId);

      const leaveGroupMessage = await Message.create({
        content : `${userDetails.username} left the group`,
        messageType : true,
        groupId : data._id,
        targetType: "message"
      })

      const uploadData = {
        _id: leaveGroupMessage._id,
        content: leaveGroupMessage.content,
        groupId: updatedGroupDetails._id,
        messageType: true,
        group: {
          image: updatedGroupDetails.image,
          _id: updatedGroupDetails._id,
          name: updatedGroupDetails.name
        }
      }

      previousGroupDetails.members.map(member => {
        const socketId = userSocketMap.get(member.userId.toString());
          if (socketId) {
            io.to(socketId).emit('receiveGroupMessage', leaveGroupMessage);
            io.to(socketId).emit('group-leave', {updated: uploadData, group: updatedGroupDetails});
          }
      })

    }

    const deleteGroup = async(data) => {
      const previousGroupDetails = await Group.findById(data._id);

      const user = previousGroupDetails.members.find (member => member.userId.toString () === data.userId);


      if (user.isActive) {
        const userDetails =  await User.findById(data.userId);

        const leaveGroupMessage = await Message.create({
          content : `${userDetails.username} left the group`,
          messageType : true,
          groupId : data._id,
          targetType: "message"
        })

        previousGroupDetails.members.map(member => {
          const socketId = userSocketMap.get(member.userId.toString());
            if (socketId) {
              io.to(socketId).emit('receiveGroupMessage', leaveGroupMessage);
            }
        });

        const latestDetails = await Group.updateOne(
          { _id: data._id },
          { $pull: { admins: { userId: new mongoose.Types.ObjectId(data.userId) } } }
        );
      }
      
      const latestDetails = await Group.updateOne(
        { _id: data._id },
        { $pull: { members: { userId: data.userId } } }
      ); 

      const groupDetails = await Group.findById (data._id);

      const socketId = userSocketMap.get(data.userId);
      io.to (socketId).emit ('group-delete', {group: groupDetails});

    }

    // follow accepted
    const followAccepted = ({ sender, recipient }) => {
      const senderSocketId = userSocketMap.get(sender.toString());;
      if (senderSocketId) {
          io.to(senderSocketId).emit('follow-accepted',  recipient);
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
        socket.on("disconnect", () => disconnect(socket));

        onlineUsers.set(socket.id, userId);
        io.emit('online-users', Array.from(onlineUsers.values()));

        socket.on("sendMessage", sendMessage);
        socket.on ("create-group", createGroup);
        socket.on ("sendGroupMessage", sendGroupMessage);
        socket.on ("update-group", updateGroupDetails);
        socket.on ("leave-group", leaveGroup);
        socket.on ("delete-group", deleteGroup);
        socket.on('follow-accepted', followAccepted);
    });
}

module.exports = setupSocket;
