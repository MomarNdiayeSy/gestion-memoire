import { Router } from 'express';
import { 
  updateProfile, 
  changePassword, 
  getUsers,
  getUserById,
  getEncadreurs,
  getEtudiants,
  createUser,
  updateUser,
  deleteUser
} from '../controllers/userController';
import { authMiddleware, checkRole } from '../middleware/authMiddleware';

const router = Router();

// Routes protégées par l'authentification
router.put('/profile', authMiddleware, updateProfile);
router.put('/password', authMiddleware, changePassword);

// Routes de listing et détails des utilisateurs - Admin seulement
router.get('/', authMiddleware, checkRole(['ADMIN']), getUsers);
router.get('/encadreurs', authMiddleware, checkRole(['ADMIN', 'ETUDIANT']), getEncadreurs);
router.get('/etudiants', authMiddleware, checkRole(['ADMIN', 'ENCADREUR']), getEtudiants);
// Routes CRUD Admin
router.post('/', authMiddleware, checkRole(['ADMIN']), createUser);
router.put('/:id', authMiddleware, checkRole(['ADMIN']), updateUser);
router.delete('/:id', authMiddleware, checkRole(['ADMIN']), deleteUser);

router.get('/:id', authMiddleware, checkRole(['ADMIN']), getUserById);

export default router; 