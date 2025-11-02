import express from 'express';
import { body } from 'express-validator';
import {
  getExpenses,
  createExpense,
  updateExpense,
  deleteExpense,
  getExpenseById,
} from '../controllers/expenseController';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validation';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

router.get('/', getExpenses);
router.post('/', [
  body('amount').isFloat({ min: 0.01 }).withMessage('Valid amount is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('date').isISO8601().withMessage('Valid date is required'),
  body('category').notEmpty().withMessage('Category is required'),
  body('payerId').notEmpty().withMessage('Payer is required'),
  body('groupId').optional().isString(),
  body('splitType').notEmpty().withMessage('Split type is required'),
  body('splits').isArray({ min: 1 }).withMessage('At least one split is required'),
], validate, createExpense);
router.get('/:id', getExpenseById);
router.put('/:id', [
  body('amount').optional().isFloat({ min: 0.01 }),
  body('description').optional().trim().notEmpty(),
  body('date').optional().isISO8601(),
  body('category').optional().notEmpty(),
], validate, updateExpense);
router.delete('/:id', deleteExpense);

export default router;

