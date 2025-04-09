
const MessageModel = require('../models/message.model');
const mongoose = require('mongoose');
const usermodel = require('../models/user.model')

const getMessage = async(sender, recipient) => {
    const response = {};
    try {
        const message1  = await MessageModel.find({
            sender : sender,
            recipient : recipient
        })
        .populate("sender", "id name image")
        .populate("recipient", "id name image");
        const message2  = await MessageModel.find({
            sender : recipient,
            recipient : sender
        })
        .populate("sender", "id name image")
        .populate("recipient", "id name image");;
        response.messages = [...message1, ...message2];
        return response;
    } catch (error) {
        response.error = error.message;
        return response;
    }
}

// const getRecentMessage = async (sender) => {
//   const response = {};
//   try {
//     // Convert sender (current user) to ObjectId if it's a string
//     const currentUserId = new mongoose.Types.ObjectId(sender); 
//     const recentChats = await MessageModel.aggregate([
//       // Step 1: Match all messages where the current user is either sender or recipient
//       {
//         $match: {
//           $or: [
//             { sender: currentUserId },
//             { recipient: currentUserId }
//           ]
//         }
//       },
//       // Step 2: Create a new field 'otherUser' to identify the person you're chatting with
//       {
//         $addFields: {
//           otherUser: {
//             $cond: [
//               { $eq: ["$sender", currentUserId] }, // If you're the sender
//               "$recipient",                        // then otherUser is the recipient
//               "$sender"                            // else it's the sender
//             ]
//           }
//         }
//       },
//       // Step 3: Sort messages by timestamp descending to get latest ones first
//       {
//         $sort: { timestamp: -1 }
//       },
//       // Step 4: Group by 'otherUser' and pick the first (most recent) message
//       {
//         $group: {
//           _id: "$otherUser",
//           latestMessage: { $first: "$$ROOT" }
//         }
//       },
//       // Step 5: Replace root document with the latest message object
//       {
//         $replaceRoot: { newRoot: "$latestMessage" }
//       }
//     ]);

//     //get userDetails of all recentChats

//     const messagesWithUserDetails = await Promise.all(
//       recentChats.map(async (chat) => {
//         const user = await usermodel.findById(chat.otherUser).select("-password -saved -following -follower -birth -resetTokenExpiry -createdAt -isPrivate -resetToken -likedPosts -about -email");
//         return {
//           ...chat,
//           user,
//         };
//       })
//     );
//     response.messages = messagesWithUserDetails
//     return response;

//   } catch (error) {
//     // Handle errors and return
//     response.error = error.message; 
//     return response;
//   }
// }

const getRecentMessage = async (sender) => {
  const response = {};
  try {
    const currentUserId = new mongoose.Types.ObjectId(sender);

    const recentChats = await MessageModel.aggregate([
      {
        $match: {
          $and: [
            {
              $or: [
                { sender: currentUserId },
                { recipient: currentUserId }
              ]
            },
            {
              $or: [
                { groupId: { $exists: false } },
                { groupId: null },
                { groupId: "" }
              ]
            } // Exclude messages with a groupId
          ]
        }
      },
      {
        $addFields: {
          otherUser: {
            $cond: {
              if: { $eq: ["$sender", currentUserId] },
              then: {
                $arrayElemAt: [
                  {
                    $filter: {
                      input: "$recipient",
                      as: "r",
                      cond: { $ne: ["$$r", currentUserId] }
                    }
                  },
                  0
                ]
              },
              else: "$sender"
            }
          }
        }
      },
      {
        $sort: { timestamp: -1 }
      },
      {
        $group: {
          _id: "$otherUser",
          latestMessage: { $first: "$$ROOT" }
        }
      },
      {
        $replaceRoot: { newRoot: "$latestMessage" }
      }
    ]);

    const messagesWithUserDetails = await Promise.all(
      recentChats.map(async (chat) => {
        const user = await usermodel.findById(chat.otherUser).select(
          "-password -saved -following -follower -birth -resetTokenExpiry -createdAt -isPrivate -resetToken -likedPosts -about -email"
        );
        return {
          ...chat,
          user,
        };
      })
    );

    response.messages = messagesWithUserDetails;
    return response;

  } catch (error) {
    response.error = error.message;
    return response;
  }
};




module.exports = {
    getMessage,
    getRecentMessage
}