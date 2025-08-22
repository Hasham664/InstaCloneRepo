import { createSlice } from '@reduxjs/toolkit';

const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    onlineUsers: [],
    messages: [],
    conversations: [], // NEW: Store all conversations
  },
  reducers: {
    setOnlineUsers: (state, action) => {
      state.onlineUsers = action.payload;
    },
    setMessages: (state, action) => {
      state.messages = action.payload;
    },
    addMessage: (state, action) => {
      state.messages.push(action.payload);
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

      // Find conversation by checking if either sender or receiver is in the conversation
      const convIndex = state.conversations.findIndex(
        (conv) => conv.user._id === senderId || conv.user._id === receiverId
      );

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
