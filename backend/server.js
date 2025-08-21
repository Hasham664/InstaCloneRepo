// server.js
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
// import bodyParser from 'body-parser';
import 'dotenv/config.js';
import connectDB from './utils/db.js';
import userRoute from './routes/user.route.js';
import postRoute from './routes/post.route.js';
import messageRoute from './routes/message.route.js';
import { server,app } from './socket/socket.js'; // Import the socket server
import path from 'path';
const PORT = process.env.PORT || 4000;
const __dirname = path.resolve();

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const corsOptions = {
  origin: [
    'https://instaclonerepo.onrender.com',
    'http://localhost:5173',
    // for local development
  ],
  credentials: true,
};
app.use(cors(corsOptions));


app.use('/api/v1/user',userRoute);
app.use('/api/v1/post', postRoute);
app.use('/api/v1/message', messageRoute);

app.use(express.static(path.join(__dirname, 'frontend/dist')));

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'frontend', 'dist', 'index.html'));
})

app.get('/', (req, res) => {
  res.send('Insta Api is running');
});
server.listen(PORT, () => {
  connectDB();
  console.log(`Server is running on port ${PORT}`);
});
