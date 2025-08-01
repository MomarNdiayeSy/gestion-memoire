import { Router } from 'express';
import { authMiddleware, checkRole } from '../middleware/authMiddleware';
import { publishMemoire, getPublishedMemoires } from '../controllers/bibliothequeController';

const router = Router();

// Toutes les routes nécessitent une authentification
router.use(authMiddleware);

// GET /api/bibliotheque -> liste des mémoires publiés
router.get('/', checkRole(['ADMIN', 'ENCADREUR', 'ETUDIANT']), getPublishedMemoires);

// PATCH /api/bibliotheque/memoires/:id/publish -> publier un mémoire (admin)
router.patch('/memoires/:id/publish', checkRole(['ADMIN']), publishMemoire);

export default router;
