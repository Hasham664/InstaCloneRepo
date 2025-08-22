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

      // Only add to messages if it's for the currently selected chat
      if (
        selectedUser &&
        (messageWithTimestamp.senderId === selectedUser._id ||
          messageWithTimestamp.receiverId === selectedUser._id)
      ) {
        dispatch(addMessage(messageWithTimestamp));
      }

      // Always update conversations for real-time preview
      dispatch(updateConversationOnNewMessage(messageWithTimestamp));
    };

    socket.on('newMessage', handleNewMessage);

    return () => {
      socket?.off('newMessage', handleNewMessage);
    };
  }, [socket, selectedUser, dispatch, user]);
};

export default useGetRTM;