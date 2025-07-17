import express from 'express';
import { createPaiement, getPaiements, getPaiementById, updatePaiementStatus, deletePaiement } from '../controllers/paiementController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

// Routes protégées par authentification
router.use(authMiddleware);

// Routes pour les paiements
router.post('/', authMiddleware, createPaiement);
router.get('/', authMiddleware, getPaiements);
router.get('/:id', authMiddleware, getPaiementById);
router.patch('/:id/status', authMiddleware, updatePaiementStatus);
router.delete('/:id', authMiddleware, deletePaiement);

export default router; 