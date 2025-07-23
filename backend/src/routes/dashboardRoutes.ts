import { Router } from 'express';
import { authMiddleware, checkRole } from '../middleware/authMiddleware';
import { getStats, getRecentActivities, getUpcomingEvents } from '../controllers/dashboardController';

const router = Router();

// All routes require ADMIN role
router.use(authMiddleware);
router.use(checkRole(['ADMIN']));

router.get('/stats', getStats);
router.get('/activities', getRecentActivities);
router.get('/events', getUpcomingEvents);

export default router;
