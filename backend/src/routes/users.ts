import express from 'express';
import { body } from 'express-validator';
import { searchUsers, updateProfile, getUserById, addFriend, getFriends, removeFriend } from '../controllers/userController';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validation';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

router.get('/search', searchUsers);
router.get('/friends', getFriends);
router.get('/:id', getUserById);
router.put('/profile', [
  body('name').optional().trim().notEmpty(),
  body('phone').optional().trim(),
], validate, updateProfile);
router.post('/friends/:friendId', addFriend);
router.delete('/friends/:friendId', removeFriend);

export default router;

