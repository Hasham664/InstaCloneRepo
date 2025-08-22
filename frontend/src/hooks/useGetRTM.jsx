// import  { useEffect } from 'react';
// import { setMessages } from '@/redux/chatSlice';
// import { useDispatch, useSelector } from 'react-redux';
// const useGetRTM = () => {
//     const {messages} = useSelector((state) => state.chat);
//     const {socket} = useSelector((state) => state.socketio);
//   const dispatch = useDispatch();
//   useEffect(() => {
//     if (!socket) return;
//       socket.on('newMessage', (newMessage) => {
//         dispatch(setMessages([...messages, newMessage]));
//     //   });
//     // socket.on('newMessage', (newMessage) => {
//     //   dispatch(setMessages((prev) => [...prev, newMessage]));
//     });

//     return () => {
//      socket?.off('newMessage');
//     };
//   }, [messages, setMessages]);
// };

// export default useGetRTM;






import { useEffect } from 'react';
import { addMessage, updateConversationOnNewMessage } from '@/redux/chatSlice';
import { useDispatch, useSelector } from 'react-redux';

const useGetRTM = () => {
  const { socket } = useSelector((state) => state.socketio);
  const { selectedUser, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!socket || !user) {
      console.log('No socket connection or user in useGetRTM');
      return;
    }

    console.log('🔄 Setting up real-time message listeners');
    console.log('👤 Current user:', user._id);
    console.log('💬 Selected user:', selectedUser?._id);
    console.log('🔗 Socket connected:', socket.connected);

    const handleNewMessage = (newMessage) => {
      console.log('=== 💬 NEW MESSAGE RECEIVED ===');
      console.log('📨 Message:', newMessage);
      console.log('👤 From:', newMessage.senderId);
      console.log('👤 To:', newMessage.receiverId);
      console.log('🆔 Current user ID:', user._id);
      console.log('🆔 Selected user ID:', selectedUser?._id);

      // Add timestamp if not present
      const messageWithTimestamp = {
        ...newMessage,
        createdAt: newMessage.createdAt || new Date().toISOString(),
      };

      // Check if this message involves the current user (either as sender or receiver)
      const isMessageForMe =
        messageWithTimestamp.receiverId === user._id ||
        messageWithTimestamp.senderId === user._id;

      if (!isMessageForMe) {
        console.log('❌ Message not for current user, ignoring');
        return;
      }

      // Check if this message is for the currently selected chat
      const isForCurrentChat =
        selectedUser &&
        // Message from selected user to current user (receiving)
        ((messageWithTimestamp.senderId === selectedUser._id &&
          messageWithTimestamp.receiverId === user._id) ||
          // Message from current user to selected user (sending - backup)
          (messageWithTimestamp.senderId === user._id &&
            messageWithTimestamp.receiverId === selectedUser._id));

      console.log('✅ Is for current chat:', isForCurrentChat);

      // Add to current chat messages if it belongs to this chat
      if (isForCurrentChat) {
        console.log('➕ Adding message to current chat');
        dispatch(addMessage(messageWithTimestamp));
      }

      // Always update conversations for preview
      console.log('🔄 Updating conversation preview');
      dispatch(updateConversationOnNewMessage(messageWithTimestamp));
    };

    // Listen for new messages
    socket.on('newMessage', handleNewMessage);

    // Test socket connection
    console.log('🧪 Testing socket connection...');
    socket.emit('ping', 'test');

    // Cleanup function
    return () => {
      console.log('🧹 Cleaning up real-time message listeners');
      socket?.off('newMessage', handleNewMessage);
    };
  }, [socket, selectedUser, dispatch, user]);
};

export default useGetRTM;