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

    const handleNewMessage = (newMessage) => {

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
      const isForCurrentChat = selectedUser && (
        // Message from selected user to current user (receiving)
        (messageWithTimestamp.senderId === selectedUser._id && 
         messageWithTimestamp.receiverId === user._id) ||
        // Message from current user to selected user (sending - backup)
        (messageWithTimestamp.senderId === user._id && 
         messageWithTimestamp.receiverId === selectedUser._id)
      );

      // Add to current chat messages if it belongs to this chat
      if (isForCurrentChat) {
        dispatch(addMessage(messageWithTimestamp));
      }

      // Always update conversations for preview
      dispatch(updateConversationOnNewMessage(messageWithTimestamp));
    };


    socket.emit('ping', 'test');

    // Cleanup function
    return () => {
      socket?.off('newMessage', handleNewMessage);
    };
  }, [socket, selectedUser, dispatch, user]);
};

export default useGetRTM;