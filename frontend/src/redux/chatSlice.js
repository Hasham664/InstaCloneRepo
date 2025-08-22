// import { createSlice } from '@reduxjs/toolkit';

// const chatSlice = createSlice({
//   name: 'chat',
//   initialState: {
//     onlineUsers: [],
//     messages: [],
//     conversations: [], // NEW: Store all conversations
//   },
//   reducers: {
//     setOnlineUsers: (state, action) => {
//       state.onlineUsers = action.payload;
//     },
//     setMessages: (state, action) => {
//       state.messages = action.payload;
//     },
//     addMessage: (state, action) => {
//       state.messages.push(action.payload);
//     },
//     setConversations: (state, action) => {
//       state.conversations = action.payload;
//     },
//     updateConversationLastMessage: (state, action) => {
//       const { userId, message } = action.payload;
//       const convIndex = state.conversations.findIndex(
//         (conv) => conv.user._id === userId
//       );
//       if (convIndex !== -1) {
//         state.conversations[convIndex].lastMessage = message;
//         state.conversations[convIndex].lastMessageTime =
//           message.createdAt || new Date().toISOString();

//         // Move this conversation to the top
//         const updatedConv = state.conversations[convIndex];
//         state.conversations.splice(convIndex, 1);
//         state.conversations.unshift(updatedConv);
//       }
//     },
//     updateConversationOnNewMessage: (state, action) => {
//       const newMessage = action.payload;
//       const senderId = newMessage.senderId;
//       const receiverId = newMessage.receiverId;

//       // Find conversation by checking if either sender or receiver is in the conversation
//       const convIndex = state.conversations.findIndex(
//         (conv) => conv.user._id === senderId || conv.user._id === receiverId
//       );

//       if (convIndex !== -1) {
//         const messageWithTimestamp = {
//           ...newMessage,
//           createdAt: newMessage.createdAt || new Date().toISOString(),
//         };

//         state.conversations[convIndex].lastMessage = messageWithTimestamp;
//         state.conversations[convIndex].lastMessageTime =
//           messageWithTimestamp.createdAt;

//         // Move this conversation to the top
//         const updatedConv = state.conversations[convIndex];
//         state.conversations.splice(convIndex, 1);
//         state.conversations.unshift(updatedConv);
//       }
//     },
//   },
// });

// export const {
//   setOnlineUsers,
//   setMessages,
//   addMessage,
//   setConversations,
//   updateConversationLastMessage,
//   updateConversationOnNewMessage,
// } = chatSlice.actions;

// export default chatSlice.reducer;


import { createSlice } from '@reduxjs/toolkit';

const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    onlineUsers: [],
    messages: [],
    conversations: [],
  },
  reducers: {
    setOnlineUsers: (state, action) => {
      // Ensure we store the online users array properly
      state.onlineUsers = Array.isArray(action.payload) ? action.payload : [];
      console.log('Updated online users:', state.onlineUsers);
    },
    setMessages: (state, action) => {
      state.messages = action.payload;
    },
    addMessage: (state, action) => {
      // Prevent duplicate messages
      const existingMessage = state.messages.find(
        (msg) => msg._id === action.payload._id
      );
      if (!existingMessage) {
        state.messages.push(action.payload);
      }
    },
    setConversations: (state, action) => {
      state.conversations = action.payload;
    },
    updateConversationLastMessage: (state, action) => {
      const { userId, message } = action.payload;
      const convIndex = state.conversations.findIndex(
        (conv) => conv.user._id === userId
      );
      if (convIndex !== -1) {
        state.conversations[convIndex].lastMessage = message;
        state.conversations[convIndex].lastMessageTime =
          message.createdAt || new Date().toISOString();

        // Move this conversation to the top
        const updatedConv = state.conversations[convIndex];
        state.conversations.splice(convIndex, 1);
        state.conversations.unshift(updatedConv);
      }
    },
    updateConversationOnNewMessage: (state, action) => {
      const newMessage = action.payload;
      const senderId = newMessage.senderId;
      const receiverId = newMessage.receiverId;

      console.log('Updating conversation for message:', newMessage);
      console.log(
        'Looking for conversation with sender:',
        senderId,
        'or receiver:',
        receiverId
      );

      // FIXED: Find conversation more reliably
      // The conversation.user._id represents the "other" user in the conversation
      let convIndex = -1;

      // Try to find conversation where the conversation.user._id matches either sender or receiver
      // but we need to be smarter about which one is the "other" user
      for (let i = 0; i < state.conversations.length; i++) {
        const conv = state.conversations[i];

        // If the conversation user is the sender, this means we're updating a conversation
        // where the current user is talking to the sender
        if (conv.user._id === senderId) {
          convIndex = i;
          break;
        }

        // If the conversation user is the receiver, this means we're updating a conversation
        // where the current user is talking to the receiver
        if (conv.user._id === receiverId) {
          convIndex = i;
          break;
        }
      }

      console.log('Found conversation at index:', convIndex);

      if (convIndex !== -1) {
        const messageWithTimestamp = {
          ...newMessage,
          createdAt: newMessage.createdAt || new Date().toISOString(),
        };

        state.conversations[convIndex].lastMessage = messageWithTimestamp;
        state.conversations[convIndex].lastMessageTime =
          messageWithTimestamp.createdAt;

        // Move this conversation to the top
        const updatedConv = state.conversations[convIndex];
        state.conversations.splice(convIndex, 1);
        state.conversations.unshift(updatedConv);

        console.log('Updated conversation:', updatedConv);
      } else {
        console.log('No matching conversation found for message');
      }
    },
  },
});

export const {
  setOnlineUsers,
  setMessages,
  addMessage,
  setConversations,
  updateConversationLastMessage,
  updateConversationOnNewMessage,
} = chatSlice.actions;

export default chatSlice.reducer;