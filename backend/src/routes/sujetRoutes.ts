import { Router } from 'express';
import {
  createSujet,
  getSujets,
  getSujetById,
  updateSujet,
  updateSujetStatus,
  deleteSujet
} from '../controllers/sujetController';
import { authMiddleware, checkRole } from '../middleware/authMiddleware';

const router = Router();

// Toutes les routes nécessitent une authentification
router.use(authMiddleware);

// Créer un sujet (ENCADREUR uniquement)
router.post('/', checkRole(['ENCADREUR', 'ADMIN']), createSujet);

// Obtenir tous les sujets (accessible à tous les utilisateurs authentifiés)
router.get('/', getSujets);

// Obtenir un sujet par ID (accessible à tous les utilisateurs authentifiés)
router.get('/:id', getSujetById);

// Mettre à jour un sujet (ADMIN et ENCADREUR propriétaire)
router.put('/:id', checkRole(['ADMIN', 'ENCADREUR']), updateSujet);

// Mettre à jour le statut d'un sujet (ADMIN uniquement)
router.patch('/:id/status', checkRole(['ADMIN']), updateSujetStatus);

// Supprimer un sujet (ADMIN et ENCADREUR propriétaire)
router.delete('/:id', checkRole(['ADMIN', 'ENCADREUR']), deleteSujet);

export default router; 