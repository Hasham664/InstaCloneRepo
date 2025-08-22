import express from 'express';
import isAuthenticated from '../middlewere/isAuthenticated.js';
import { getAllConversations, getMessage, sendMessage } from '../controllers/message.controller.js';

const router = express.Router();

// router.route('/send/:id').post(isAuthenticated, sendMessage);
// router.route('/all/:id').get(isAuthenticated, getMessage);

router.route('/send/:id').post(isAuthenticated, sendMessage);
router.route('/all/:id').get(isAuthenticated, getMessage);
router.route('/conversations').get(isAuthenticated, getAllConversations); // NEW ROUTE



export default router;