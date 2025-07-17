import { Router } from 'express';
import {
  createSession,
  getSessions,
  getSessionById,
  updateSession,
  deleteSession
} from '../controllers/sessionController';
import { authMiddleware, checkRole } from '../middleware/authMiddleware';

const router = Router();

// Toutes les routes nécessitent une authentification
router.use(authMiddleware);

// Créer une session (ENCADREUR uniquement)
router.post('/', checkRole(['ENCADREUR']), createSession);

// Obtenir toutes les sessions
router.get('/', getSessions);

// Obtenir une session par ID
router.get('/:id', getSessionById);

// Mettre à jour une session (ENCADREUR uniquement)
router.put('/:id', checkRole(['ENCADREUR']), updateSession);

// Supprimer une session (ENCADREUR uniquement)
router.delete('/:id', checkRole(['ENCADREUR']), deleteSession);

export default router; 