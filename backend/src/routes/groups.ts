import express from 'express';
import { body } from 'express-validator';
import {
  getGroups,
  createGroup,
  getGroupById,
  updateGroup,
  deleteGroup,
  addMember,
  removeMember,
} from '../controllers/groupController';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validation';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

router.get('/', getGroups);
router.post('/', [
  body('name').trim().notEmpty().withMessage('Group name is required'),
  body('memberIds').optional().isArray(),
], validate, createGroup);
router.get('/:id', getGroupById);
router.put('/:id', [
  body('name').optional().trim().notEmpty(),
], validate, updateGroup);
router.delete('/:id', deleteGroup);
router.post('/:id/members', [
  body('userIds').isArray({ min: 1 }).withMessage('At least one member is required'),
], validate, addMember);
router.delete('/:id/members/:userId', removeMember);

export default router;

