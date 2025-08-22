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
    if (!socket) return;

    const handleNewMessage = (newMessage) => {
      // Add timestamp if not present
      const messageWithTimestamp = {
        ...newMessage,
        createdAt: newMessage.createdAt || new Date().toISOString(),
      };

      console.log('New message received:', messageWithTimestamp);
      console.log('Current user ID:', user?._id);
      console.log('Selected user ID:', selectedUser?._id);
      console.log('Message sender ID:', messageWithTimestamp.senderId);
      console.log('Message receiver ID:', messageWithTimestamp.receiverId);

      // FIXED: Add message to current chat if it involves the selected user
      if (selectedUser && user) {
        const isMessageForCurrentChat =
          // Message is from selected user to current user (receiver)
          (messageWithTimestamp.senderId === selectedUser._id &&
            messageWithTimestamp.receiverId === user._id) ||
          // Message is from current user to selected user (sender - but this is handled by sendMessageHandler)
          (messageWithTimestamp.senderId === user._id &&
            messageWithTimestamp.receiverId === selectedUser._id);

        if (isMessageForCurrentChat) {
          dispatch(addMessage(messageWithTimestamp));
        }
      }

      // Always update conversations for real-time preview
      dispatch(updateConversationOnNewMessage(messageWithTimestamp));
    };

    const handleUserStatusUpdate = (data) => {
      console.log('User status update:', data);
      // Handle online/offline status updates if needed
    };

    socket.on('newMessage', handleNewMessage);
    socket.on('userStatusUpdate', handleUserStatusUpdate);

    return () => {
      socket?.off('newMessage', handleNewMessage);
      socket?.off('userStatusUpdate', handleUserStatusUpdate);
    };
  }, [socket, selectedUser, dispatch, user]);
};

export default useGetRTM;