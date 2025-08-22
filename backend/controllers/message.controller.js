// import { Message } from "../models/message.model.js";
// import { Conversation } from "../models/conversational.model.js";
// import {  getReceiverSocketId, io } from "../socket/socket.js";

// export const sendMessage = async (req, res) => {
//     try {
//         const senderId = req.id;
//         const receiverId = req.params.id;
//         const {textMessage: messages } = req.body;
//         console.log(messages,'message');

//         let conversation = await Conversation.findOne({
//             participants: { $all: [senderId, receiverId] },
//         });
//         if(!conversation) {
//             conversation = await Conversation.create({
//                 participants: [senderId, receiverId],
//             });
//         }
//         const newMessage = new Message({
//           senderId,
//           receiverId,
//           messages,
//         });
//         if(newMessage) {
//             conversation.messages.push(newMessage._id);
//         }
//         await Promise.all([
//             conversation.save(),
//             newMessage.save(),
//         ]);
//         const reciverSocketId = getReceiverSocketId(receiverId);
//         if(reciverSocketId) {
//         io.to(reciverSocketId).emit('newMessage',newMessage); 
//         }
//         return res
//             .status(200)
//             .json({ message: 'Message sent successfully', newMessage, success: true });
//     } catch (error) {
//         console.log(error);
//         return res.status(500).json({ message: 'Something went wrong' });
//     }
// };


// export const getMessage = async (req, res) => {
//     try {
//         const senderId = req.id;
//         const receiverId = req.params.id;
//         const conversation = await Conversation.findOne({
//             participants: { $all: [senderId, receiverId] }
//         }).populate('messages');
//         if(!conversation) {
//             return res
//                 .status(200)
//                 .json({ messages: [], success: true });
//         }

//         return res
//           .status(200).json({ messages: conversation?.messages, success: true,});
//     } catch (error) {
//         console.log(error);
//         return res.status(500).json({ message: 'Something went wrong' });
//     }
// };




import { Message } from '../models/message.model.js';
import { Conversation } from "../models/conversational.model.js";
import { getReceiverSocketId, io } from '../socket/socket.js';
// import { User } from '../models/user.model.js';

export const sendMessage = async (req, res) => {
  try {
    const senderId = req.id;
    const receiverId = req.params.id;
    const { textMessage: messages } = req.body;

    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
      });
    } else {
      console.log('Backend - Found existing conversation:', conversation._id);
    }
    const newMessage = new Message({
      senderId,
      receiverId,
      messages,
      // Remove manual createdAt - let timestamps: true handle it
    });

    if (newMessage) {
      conversation.messages.push(newMessage._id);
      conversation.lastMessage = newMessage._id;
      conversation.lastMessageTime = new Date();
    }

    await Promise.all([conversation.save(), newMessage.save()]);

    // Populate the message with full details for socket emission
    const populatedMessage = await Message.findById(newMessage._id);
    console.log('Backend - Populated message:', populatedMessage);

    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit('newMessage', populatedMessage);
    } else {
      console.log('Backend - Receiver not online');
    }

    return res.status(200).json({
      message: 'Message sent successfully',
      newMessage: populatedMessage,
      success: true,
    });
  } catch (error) {
    console.error('Backend - Error in sendMessage:', error);
    return res.status(500).json({ message: 'Something went wrong' });
  }
};

export const getMessage = async (req, res) => {
  try {
    const senderId = req.id;
    const receiverId = req.params.id;

    console.log('Backend - getMessage called');
    console.log('Backend - senderId:', senderId);
    console.log('Backend - receiverId:', receiverId);

    const conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    }).populate('messages');

    if (!conversation) {
      console.log('Backend - No conversation found');
      return res.status(200).json({ messages: [], success: true });
    }

    return res.status(200).json({
      messages: conversation?.messages,
      success: true,
    });
  } catch (error) {
    console.error('Backend - Error in getMessage:', error);
    return res.status(500).json({ message: 'Something went wrong' });
  }
};

// NEW: Get all conversations with last messages
export const getAllConversations = async (req, res) => {
  try {
    const userId = req.id;

    const conversations = await Conversation.find({
      participants: userId,
    })
      .populate({
        path: 'participants',
        select: 'username profilePicture profilePhoto',
      })
      .populate({
        path: 'lastMessage',
        select: 'messages senderId createdAt',
      })
      .sort({ lastMessageTime: -1 });

    const conversationsWithDetails = conversations.map((conv) => {
      const otherUser = conv.participants.find(
        (p) => p._id.toString() !== userId
      );
      return {
        _id: conv._id,
        user: otherUser,
        lastMessage: conv.lastMessage,
        lastMessageTime: conv.lastMessageTime,
      };
    });

    return res.status(200).json({
      conversations: conversationsWithDetails,
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Something went wrong' });
  }
};