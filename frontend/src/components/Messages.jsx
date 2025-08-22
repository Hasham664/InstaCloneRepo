// import React from 'react';
// import { Avatar } from './ui/avatar';
// import { AvatarImage } from '@radix-ui/react-avatar';
// import { Link } from 'react-router-dom';
// import { Button } from './ui/button';
// import { useSelector } from 'react-redux';
// import useGetAllMessages from '@/hooks/useGetAllMessages';
// import useGetRTM from '@/hooks/useGetRTM';

// const Messages = ({ selectedUser }) => {
//   useGetRTM();
//   useGetAllMessages();
//   const {messages} = useSelector((state) => state.chat);
//   const { user } = useSelector((state) => state.auth);
//   return (
//     <div className='relative z-50 flex-1 p-4 overflow-y-auto '>
//       <div className='flex justify-center'>
//         <div className='flex flex-col items-center justify-center'>
//           <Avatar className='w-20 h-20 mb-4'>
//             <AvatarImage
//               className='object-cover w-full h-full rounded-full'
//               src={
//                 selectedUser?.profilePicture || 'https://github.com/shadcn.png'
//               }
//             />
//           </Avatar>
//           <h4 className='text-lg font-semibold'>{selectedUser?.username}</h4>
//           <Link
//             to={`/profile/${selectedUser?._id}`}
//             className='text-sm text-gray-500'
//           >
//             <Button variant='secondary' className='h-8 my-2 '>
//               View Profile
//             </Button>
//           </Link>
//         </div>
//       </div>
//       <div className='flex flex-col items-start gap-3 pb-4 '>
//         {messages?.map((msg, index) => (
//           <div
//             key={index}
//             className={`max-w-[70%] p-2 rounded-lg ${
//               msg.senderId?.toString() === user._id?.toString()
//                 ? 'self-end bg-blue-500 text-white'
//                 : 'self-start bg-gray-200 text-black'
//             }`}
//           >
//             <p className='text-sm'>{msg?.messages}</p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Messages;

import React, { useEffect, useRef } from 'react';
import { Avatar } from './ui/avatar';
import { AvatarImage } from '@radix-ui/react-avatar';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { useSelector } from 'react-redux';
import useGetAllMessages from '@/hooks/useGetAllMessages';

const Messages = ({ selectedUser }) => {
  useGetAllMessages();
  // useGetRTM();
  const { messages } = useSelector((state) => state.chat);
  const { user } = useSelector((state) => state.auth);
  const messagesEndRef = useRef(null);

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className='relative z-50 flex-1 p-4 overflow-y-auto'>
      <div className='flex justify-center'>
        <div className='flex flex-col items-center justify-center'>
          <Avatar className='w-20 h-20 mb-4'>
            <AvatarImage
              className='object-cover w-full h-full rounded-full'
              src={
                selectedUser?.profilePicture ||
                selectedUser?.profilePhoto ||
                'https://github.com/shadcn.png'
              }
            />
          </Avatar>
          <h4 className='text-lg font-semibold'>{selectedUser?.username}</h4>
          <Link
            to={`/profile/${selectedUser?._id}`}
            className='text-sm text-gray-500'
          >
            <Button variant='secondary' className='h-8 my-2'>
              View Profile
            </Button>
          </Link>
        </div>
      </div>

      <div className='flex flex-col gap-3 '>
        {messages?.map((msg, index) => {
          const isMyMessage = msg.senderId?.toString() === user._id?.toString();

          let messageTime = 'Now';
          try {
            if (msg.createdAt) {
              const date = new Date(msg.createdAt);
              if (!isNaN(date.getTime())) {
                messageTime = date.toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                });
              } 
            } 
          } catch (error) {
            messageTime = 'Now';
          }

          return (
            <div
              key={msg._id || index}
              className={`flex ${
                isMyMessage ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-[70%] p-3 rounded-lg ${
                  isMyMessage
                    ? 'bg-blue-500 text-white rounded-br-sm'
                    : 'bg-gray-200 text-black rounded-bl-sm'
                }`}
              >
                <p className='text-sm'>{msg?.messages}</p>
                <p
                  className={`text-xs mt-1 ${
                    isMyMessage ? 'text-blue-100' : 'text-gray-500'
                  }`}
                >
                  {messageTime}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default Messages;
