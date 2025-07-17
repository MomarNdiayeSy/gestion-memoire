import express from 'express';
import { createJury, getJurys, getJuryById, updateJury, deleteJury } from '../controllers/juryController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

// Routes protégées par authentification
router.use(authMiddleware);

// Routes accessibles uniquement aux administrateurs
router.post('/', authMiddleware, createJury);
router.get('/', authMiddleware, getJurys);
router.get('/:id', authMiddleware, getJuryById);
router.put('/:id', authMiddleware, updateJury);
router.delete('/:id', authMiddleware, deleteJury);

export default router; 