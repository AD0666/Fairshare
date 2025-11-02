import express from 'express';
import { body } from 'express-validator';
import { createSettlement, getSettlements, getSimplifiedDebts } from '../controllers/settlementController';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validation';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

router.get('/', getSettlements);
router.get('/simplify', getSimplifiedDebts);
router.post('/', [
  body('receiverId').notEmpty().withMessage('Receiver is required'),
  body('amount').isFloat({ min: 0.01 }).withMessage('Valid amount is required'),
  body('groupId').optional().isString(),
], validate, createSettlement);

export default router;

