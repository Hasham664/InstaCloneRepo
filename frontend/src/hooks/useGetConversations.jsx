import { useEffect } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setConversations } from '@/redux/chatSlice';

const useGetConversations = () => {
  const BACKENDURL = import.meta.env.VITE_BACKEND_URL;
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const response = await axios.get(
          `${BACKENDURL}/message/conversations`,
          {
            withCredentials: true,
          }
        );

        if (response.data.success) {
          dispatch(setConversations(response.data.conversations));
        }
      } catch (error) {
        console.error('Error fetching conversations:', error);
      }
    };

    if (user?._id) {
      fetchConversations();
    }
  }, [user?._id, BACKENDURL, dispatch]);
};

export default useGetConversations;
