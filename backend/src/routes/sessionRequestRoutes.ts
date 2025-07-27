import { Router } from 'express';
import { authMiddleware, checkRole } from '../middleware/authMiddleware';
import {
  createRequest,
  getRequests,
  updateRequest,
} from '../controllers/sessionRequestController';

const router = Router();

router.use(authMiddleware);

// Étudiant crée une demande
router.post('/', checkRole(['ETUDIANT']), createRequest);

// Encadreur ou étudiant liste ses demandes
router.get('/', getRequests);

// Encadreur accepte/refuse
router.patch('/:id', checkRole(['ENCADREUR']), updateRequest);

export default router;
