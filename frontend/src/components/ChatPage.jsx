// import { setSelectedUser } from '@/redux/authSlice';
// import { Avatar, AvatarImage } from '@radix-ui/react-avatar';
// import React, { useEffect, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { Input } from './ui/input';
// import { MessageCircle, ArrowLeft } from 'lucide-react';
// import { Button } from './ui/button';
// import Messages from './Messages';
// import axios from 'axios';
// import { addMessage, updateConversationLastMessage } from '@/redux/chatSlice';
// import { Link } from 'react-router-dom';
// import useGetConversations from '@/hooks/useGetConversations';
// import useGetRTM from '@/hooks/useGetRTM';

// function ChatPreview({ conversation, user }) {
//     const lastMessage = conversation.lastMessage;
    
//     if (!lastMessage) return null;

//     const isFromMe = lastMessage.senderId === user._id;
//     const timeAgo = new Date(lastMessage.createdAt).toLocaleTimeString('en-US', {
//         hour: '2-digit',
//         minute: '2-digit'
//     });

//     return (
//         <div className="flex flex-col">
//             <p className={`truncate max-sm:max-w-[250px] max-md:max-w-[80px] max-lg:max-w-[130px] lg:max-w-[200px] text-sm ${
//                 isFromMe ? 'font-normal text-gray-300' : 'font-semibold text-white'
//             }`}>
//                 {isFromMe ? `You: ${lastMessage.messages}` : lastMessage.messages}
//             </p>
//             <span className='text-xs text-gray-500'>{timeAgo}</span>
//         </div>
//     );
// }

// const ChatPage = () => {
//     const BACKENDURL = import.meta.env.VITE_BACKEND_URL;
//     const [textMessage, setTextMessage] = useState('');
    
//     // Use conversations from Redux instead of SuggestedUser
//     const { user, selectedUser } = useSelector((state) => state.auth);
//     const { onlineUsers, conversations } = useSelector((state) => state.chat);
//     const dispatch = useDispatch();

//     // Custom hooks
//     useGetConversations();
//     useGetRTM();

//     const sendMessageHandler = async (receiverId) => {
//         try {
//             const res = await axios.post(
//                 `${BACKENDURL}/message/send/${receiverId}`,
//                 { textMessage },
//                 {
//                     headers: { 'Content-Type': 'application/json' },
//                     withCredentials: true,
//                 }
//             );
            
//             if (res.data.success) {
//                 dispatch(addMessage(res.data.newMessage));
//                 setTextMessage('');
                
//                 // Update conversation last message
//                 dispatch(updateConversationLastMessage({
//                     conversationId: res.data.conversationId,
//                     message: res.data.newMessage
//                 }));
//             }
//         } catch (error) {
//             console.error('Error sending message:', error);
//         }
//     };

//     useEffect(() => {
//         return () => {
//             dispatch(setSelectedUser(null));
//         };
//     }, [dispatch]);

//     return (
//         <div className='flex bg-black text-white max-md:ml-[0%] max-lg:ml-[10%] lg:ml-[16%] h-screen'>
//             {/* User list section */}
//             <section className={`md:my-8 mt-4 max-sm:w-full max-md:w-[30%] md:w-1/3 
//                 ${selectedUser ? 'max-sm:hidden' : 'block'}
//             `}>
//                 <h1 className='px-3 mb-4 text-xl font-bold'>{user?.username}</h1>
//                 <hr className='mb-4 border-gray-400' />
                
//                 <div className='overflow-y-auto h-[76%] md:h-[80vh]'>
//                     {conversations?.map((conversation) => {
//                         const otherUser = conversation.user;
//                         const isOnline = onlineUsers.includes(otherUser?._id);

//                         return (
//                             <div
//                                 onClick={() => {
//                                     dispatch(setSelectedUser(otherUser));
//                                 }}
//                                 key={conversation._id}
//                                 className='flex items-center px-3 py-2 cursor-pointer md:hover:text-black md:hover:bg-white'
//                             >
//                                 <Avatar className='mr-3 rounded-full h-14 w-14'>
//                                     <AvatarImage
//                                         className='object-cover w-full h-full rounded-full'
//                                         src={otherUser?.profilePicture || otherUser?.profilePhoto || 'https://github.com/shadcn.png'}
//                                     />
//                                 </Avatar>
                                
//                                 <div className='flex flex-col flex-1'>
//                                     <p className='font-medium'>{otherUser?.username}</p>
//                                     <p className={`text-xs font-bold ${
//                                         isOnline ? 'text-green-500' : 'text-red-500'
//                                     }`}>
//                                         {isOnline ? 'Online' : 'Offline'}
//                                     </p>
//                                     <ChatPreview conversation={conversation} user={user} />
//                                 </div>
//                             </div>
//                         );
//                     })}
//                 </div>
//             </section>

//             {/* Chat Section */}
//             {selectedUser ? (
//                 <section className='flex flex-col flex-1 h-full p-1 border-l border-gray-300 md:p-4'>
//                     <div className='sticky top-0 z-10 flex items-center gap-3 px-3 py-2 bg-black border-b border-gray-300'>
//                         <button
//                             onClick={() => dispatch(setSelectedUser(null))}
//                             className='sm:hidden'
//                         >
//                             <ArrowLeft className='w-6 h-6 text-white' />
//                         </button>
                        
//                         <Avatar className='rounded-full h-14 w-14'>
//                             <Link to={`/profile/${selectedUser?._id}`}>
//                                 <AvatarImage
//                                     className='object-cover w-full h-full rounded-full'
//                                     src={selectedUser?.profilePicture || selectedUser?.profilePhoto || 'https://github.com/shadcn.png'}
//                                 />
//                             </Link>
//                         </Avatar>
                        
//                         <Link to={`/profile/${selectedUser?._id}`}>
//                             <div className='flex flex-col'>
//                                 <p className='font-medium'>{selectedUser?.username}</p>
//                             </div>
//                         </Link>
//                     </div>

//                     <Messages selectedUser={selectedUser} />

//                     <div className='flex items-center p-4 border-t border-gray-300 max-md:pb-20'>
//                         <Input
//                             value={textMessage}
//                             onChange={(e) => setTextMessage(e.target.value)}
//                             onKeyPress={(e) => {
//                                 if (e.key === 'Enter' && textMessage.trim()) {
//                                     sendMessageHandler(selectedUser?._id);
//                                 }
//                             }}
//                             type='text'
//                             className='flex-1 mr-2 text-black focus-visible:ring-transparent'
//                             placeholder='Type a message'
//                         />
//                         <Button 
//                             onClick={() => sendMessageHandler(selectedUser?._id)}
//                             disabled={!textMessage.trim()}
//                         >
//                             Send
//                         </Button>
//                     </div>
//                 </section>
//             ) : (
//                 <div className='flex-col items-center justify-center hidden mx-auto sm:flex'>
//                     <MessageCircle className='w-32 h-32 my-4' />
//                     <h1 className='text-lg font-bold'>Select a user</h1>
//                     <p className='text-gray-500'>Start chatting with someone!</p>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default ChatPage;



import { setSelectedUser } from '@/redux/authSlice';
import { Avatar, AvatarImage } from '@radix-ui/react-avatar';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Input } from './ui/input';
import { MessageCircle, ArrowLeft } from 'lucide-react';
import { Button } from './ui/button';
import Messages from './Messages';
import axios from 'axios';
import { addMessage, updateConversationLastMessage } from '@/redux/chatSlice';
import { Link } from 'react-router-dom';
import useGetConversations from '@/hooks/useGetConversations';
import useGetRTM from '@/hooks/useGetRTM';

function ChatPreview({ conversation, user }) {
  const lastMessage = conversation.lastMessage;

  if (!lastMessage) return null;

  const isFromMe = lastMessage.senderId === user._id;

  // Create a new Date object to ensure proper time formatting
  const messageDate = new Date(lastMessage.createdAt);
  const timeAgo = messageDate.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className='flex flex-col'>
      <p
        className={`truncate max-sm:max-w-[250px] max-md:max-w-[80px] max-lg:max-w-[130px] lg:max-w-[200px] text-sm ${
          isFromMe ? 'font-normal text-gray-300' : 'font-semibold text-white'
        }`}
      >
        {isFromMe ? `You: ${lastMessage.messages}` : lastMessage.messages}
      </p>
      <span className='text-xs text-gray-500'>{timeAgo}</span>
    </div>
  );
}

const ChatPage = () => {
  const BACKENDURL = import.meta.env.VITE_BACKEND_URL;
  const [textMessage, setTextMessage] = useState('');

  // Use conversations from Redux instead of SuggestedUser
  const { user, selectedUser } = useSelector((state) => state.auth);
  const { onlineUsers, conversations } = useSelector((state) => state.chat);
  const dispatch = useDispatch();

  // Custom hooks
  useGetConversations();
  useGetRTM();

   const sendMessageHandler = async (receiverId) => {
     try {
       const res = await axios.post(
         `${BACKENDURL}/message/send/${receiverId}`,
         { textMessage },
         {
           headers: { 'Content-Type': 'application/json' },
           withCredentials: true,
         }
       );

       if (res.data.success) {
         const messageWithTimestamp = {
           ...res.data.newMessage,
           createdAt: res.data.newMessage.createdAt || new Date().toISOString(),
         };

         dispatch(addMessage(messageWithTimestamp));
         setTextMessage('');

         // Update conversation last message - Fixed: use userId instead of conversationId
         dispatch(
           updateConversationLastMessage({
             userId: receiverId,
             message: messageWithTimestamp,
           })
         );
       }
     } catch (error) {
       console.error('Error sending message:', error);
     }
   };


  useEffect(() => {
    return () => {
      dispatch(setSelectedUser(null));
    };
  }, [dispatch]);

  return (
    <div className='flex bg-black text-white max-md:ml-[0%] max-lg:ml-[10%] lg:ml-[16%] h-screen'>
      {/* User list section */}
      <section
        className={`md:my-8 mt-4 max-sm:w-full max-md:w-[30%] md:w-1/3 
                ${selectedUser ? 'max-sm:hidden' : 'block'}
            `}
      >
        <h1 className='px-3 mb-4 text-xl font-bold'>{user?.username}</h1>
        <hr className='mb-4 border-gray-400' />

        <div className='overflow-y-auto h-[76%] md:h-[80vh]'>
          {conversations?.map((conversation) => {
            const otherUser = conversation.user;
            const isOnline = onlineUsers.includes(otherUser?._id);

            return (
              <div
                onClick={() => {
                  dispatch(setSelectedUser(otherUser));
                }}
                key={conversation._id}
                className='flex items-center px-3 py-2 cursor-pointer md:hover:text-white md:hover:bg-gray-900 '
              >
                <Avatar className='mr-3 rounded-full h-14 w-14'>
                  <AvatarImage
                    className='object-cover w-full h-full rounded-full'
                    src={
                      otherUser?.profilePicture ||
                      otherUser?.profilePhoto ||
                      'https://github.com/shadcn.png'
                    }
                  />
                </Avatar>

                <div className='flex flex-col flex-1'>
                  <p className='font-medium'>{otherUser?.username}</p>
                  <p
                    className={`text-xs font-bold ${
                      isOnline ? 'text-green-500' : 'text-red-500'
                    }`}
                  >
                    {isOnline ? 'Online' : 'Offline'}
                  </p>
                  <ChatPreview conversation={conversation} user={user} />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Chat Section */}
      {selectedUser ? (
        <section className='flex flex-col flex-1 h-full p-1 border-l border-gray-300 md:p-4'>
          <div className='sticky top-0 z-10 flex items-center gap-3 px-3 py-2 bg-black border-b border-gray-300'>
            <button
              onClick={() => dispatch(setSelectedUser(null))}
              className='sm:hidden'
            >
              <ArrowLeft className='w-6 h-6 text-white' />
            </button>

            <Avatar className='rounded-full h-14 w-14'>
              <Link to={`/profile/${selectedUser?._id}`}>
                <AvatarImage
                  className='object-cover w-full h-full rounded-full'
                  src={
                    selectedUser?.profilePicture ||
                    selectedUser?.profilePhoto ||
                    'https://github.com/shadcn.png'
                  }
                />
              </Link>
            </Avatar>

            <Link to={`/profile/${selectedUser?._id}`}>
              <div className='flex flex-col'>
                <p className='font-medium'>{selectedUser?.username}</p>
              </div>
            </Link>
          </div>

          <Messages selectedUser={selectedUser} />

          <div className='flex items-center p-4 border-t border-gray-300 max-md:pb-20'>
            <Input
              value={textMessage}
              onChange={(e) => setTextMessage(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && textMessage.trim()) {
                  sendMessageHandler(selectedUser?._id);
                }
              }}
              type='text'
              className='flex-1 mr-2 text-black focus-visible:ring-transparent'
              placeholder='Type a message'
            />
            <Button
              onClick={() => sendMessageHandler(selectedUser?._id)}
              disabled={!textMessage.trim()}
            >
              Send
            </Button>
          </div>
        </section>
      ) : (
        <div className='flex-col items-center justify-center hidden mx-auto sm:flex'>
          <MessageCircle className='w-32 h-32 my-4' />
          <h1 className='text-lg font-bold'>Select a user</h1>
          <p className='text-gray-500'>Start chatting with someone!</p>
        </div>
      )}
    </div>
  );
};

export default ChatPage;