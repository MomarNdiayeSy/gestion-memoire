import { Router } from 'express';
import {
  createMemoire,
  getMemoires,
  getMemoireById,
  updateMemoireStatus,
  updateMemoire,
  addDocument
} from '../controllers/memoireController';
import { authMiddleware, checkRole } from '../middleware/authMiddleware';

const router = Router();

// Toutes les routes nécessitent une authentification
router.use(authMiddleware);

// Créer un mémoire (ETUDIANT uniquement)
router.post('/', checkRole(['ETUDIANT']), createMemoire);

// Obtenir tous les mémoires (ADMIN, ENCADREUR, ETUDIANT)
router.get('/', checkRole(['ADMIN', 'ENCADREUR', 'ETUDIANT']), getMemoires);

// Obtenir un mémoire par ID
router.get('/:id', getMemoireById);

// Mettre à jour le statut d'un mémoire
router.patch('/:id/status', updateMemoireStatus);

// Mettre à jour un mémoire (ETUDIANT propriétaire uniquement)
router.put('/:id', checkRole(['ADMIN', 'ETUDIANT']), updateMemoire);

// Ajouter un document au mémoire (ETUDIANT propriétaire uniquement)
router.post('/:id/documents', checkRole(['ETUDIANT']), addDocument);

export default router; 