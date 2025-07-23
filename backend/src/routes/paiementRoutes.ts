import express from 'express';
import { createPaiement, getPaiements, getPaiementById, updatePaiementStatus, deletePaiement, getPaiementStats, updatePaiement } from '../controllers/paiementController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

// Routes protégées par authentification
router.use(authMiddleware);

// Route statistiques
router.get('/stats', authMiddleware, getPaiementStats);

// Routes pour les paiements
router.post('/', authMiddleware, createPaiement);
router.get('/', authMiddleware, getPaiements);
router.get('/:id', authMiddleware, getPaiementById);
router.put('/:id', authMiddleware, updatePaiement);
router.patch('/:id/status', authMiddleware, updatePaiementStatus);
router.delete('/:id', authMiddleware, deletePaiement);

export default router; 