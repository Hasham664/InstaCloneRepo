// import React, { useEffect } from 'react';
// import axios from 'axios';
// import { useDispatch, useSelector } from 'react-redux';
// import { setMessages } from '@/redux/chatSlice';

// const useGetAllMessages = () => {
//   const BACKENDURL = import.meta.env.VITE_BACKEND_URL;
//   const {selectedUser} = useSelector((state) => state.auth);
//     const dispatch = useDispatch();
//   useEffect(() => {
//     const fetchAllMessage = async () => {
//       try {
//         const response = await axios.get(
//           `${BACKENDURL}/message/all/${selectedUser._id}`,
//           {
//             withCredentials: true,
//           }
//         );
//         if (response.data.success) {
//           console.log(response.data);

//           dispatch(setMessages(response.data.messages));
//           // dispatch(setMessages([...messages, newMessage]));

//         }
//       } catch (error) {
//         console.error('Error fetching posts:', error);
//       }
//     };
// //  if (!selectedUser?._id) return;
//     fetchAllMessage();
//   }, [selectedUser]);
// };

// export default useGetAllMessages;




import { useEffect } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setMessages } from '@/redux/chatSlice';

const useGetAllMessages = () => {
  const BACKENDURL = import.meta.env.VITE_BACKEND_URL;
  const { selectedUser } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchAllMessages = async () => {
      try {
        const response = await axios.get(
          `${BACKENDURL}/message/all/${selectedUser._id}`,
          {
            withCredentials: true,
          }
        );

        if (response.data.success) {
          // FIXED: Clear messages first, then set new ones          
          dispatch(setMessages(response.data.messages));
          
        //  dispatch(setMessages([...messages, ...response.data.messages]));
         
        }
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    // Only fetch if selectedUser exists
    if (selectedUser?._id) {
      fetchAllMessages();
    } else {
      // Clear messages when no user is selected
      dispatch(setMessages([]));
    }
  }, [selectedUser?._id, BACKENDURL, dispatch]);
};

export default useGetAllMessages;