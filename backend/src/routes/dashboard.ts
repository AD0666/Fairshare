import express from 'express';
import { getBalance, getStats } from '../controllers/dashboardController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

router.get('/balance', getBalance);
router.get('/stats', getStats);

export default router;

