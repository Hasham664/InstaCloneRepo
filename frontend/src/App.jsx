import Login from "./components/Login"
import MainLayout from "./components/MainLayout"
import Signup from "./components/Signup"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import Profile from "./components/Profile"
import Home from "./components/Home"
import EditProfile from "./components/EditProfile"
import ChatPage from "./components/ChatPage"
import {io} from 'socket.io-client';
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux"
import { setSocket } from "./redux/socketSlice"
import { setOnlineUsers } from "./redux/chatSlice"
import { setLikeNotification } from "./redux/rtnSlice"
import axios from "axios"
import ProtectedRoute from "./components/ProtectedRoute"
// import { connectSocket, disconnectSocket } from "./socketIo/socketService"
const router = createBrowserRouter([
  {
    path: '/',
    element: <ProtectedRoute> <MainLayout /></ProtectedRoute> ,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: '/profile/:id',
        element:   <Profile />,
      },
      {
        path: '/account/edit',
        element:  <EditProfile />,
      },
      {
        path: '/chat',
        element:  <ChatPage />,
      },
    ],
  },
  {
    path: '/signup',
    element: <Signup />,
  },
  {
    path: '/login',
    element: <Login />,
  },
]);
function App() {
  const BACKENDURL = import.meta.env.VITE_SOCKET_URL;
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  useEffect(() => {
    if (user) {
      // Connect socket with proper configuration
      const socketio = io(BACKENDURL, {
        query: { userId: user._id },
        transports: ['websocket', 'polling'], // Allow both transports
        withCredentials: true,
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      });

      // Store socket in Redux
      dispatch(setSocket(socketio));

      // Socket connection events for debugging
      socketio.on('connect', () => {
        socketio.emit('addUser', user._id);
      });

  

      // Listen for online users updates
      socketio.on('getOnlineUsers', (onlineUsers) => {
        dispatch(setOnlineUsers(onlineUsers));
      });

      // Listen for new messages (for real-time chat)
    ;

      // Listen for notifications
      socketio.on('notification', (notification) => {
        console.log('🔔 Notification received:', notification);
        dispatch(setLikeNotification(notification));
      });

      // Fetch unread notifications from DB
      // axios.get(`${BACKENDURL}/post/notifications`, {
      //     withCredentials: true,
      //   })
      //   .then((res) => {
      //     const { notifications } = res.data;
      //     if (Array.isArray(notifications)) {
      //       notifications.forEach((notif) => {
      //         dispatch(setLikeNotification(notif));
      //       });
      //     }
      //   })
      //   .catch(console.error);

      // Cleanup function
      return () => {
        socketio.emit('removeUser', user._id);
        socketio.close();
        dispatch(setSocket(null));
        dispatch(setOnlineUsers([])); // Clear online users when disconnecting
      };
    } else {
      // Clear socket and online users when user logs out
      dispatch(setSocket(null));
      dispatch(setOnlineUsers([]));
    }
  }, [user, dispatch, BACKENDURL]);

  return (
  <div>
  <RouterProvider router={router}/>
  </div>
  )
}

export default App
