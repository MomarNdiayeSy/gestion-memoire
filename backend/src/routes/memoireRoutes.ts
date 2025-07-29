import { Router } from 'express';
import {
  createMemoire,
  getMemoires,
  getMemoireById,
  getMyMemoire,
  uploadFinal,
  validateFinalByEncadreur,
  validateFinalByAdmin,
  updateMemoireStatus,
  updateMemoire,
  addDocument,
  updateDocumentComment
} from '../controllers/memoireController';
import { authMiddleware, checkRole } from '../middleware/authMiddleware';

const router = Router();

// Toutes les routes nécessitent une authentification
router.use(authMiddleware);

// Créer un mémoire (ETUDIANT uniquement)
router.post('/', checkRole(['ETUDIANT']), createMemoire);

// Obtenir le mémoire de l'étudiant connecté
router.get('/me', checkRole(['ETUDIANT']), getMyMemoire);

// Obtenir tous les mémoires (ADMIN, ENCADREUR, ETUDIANT)
router.get('/', checkRole(['ADMIN', 'ENCADREUR', 'ETUDIANT']), getMemoires);

// Obtenir un mémoire par ID
router.get('/:id', getMemoireById);

// Mettre à jour le statut d'un mémoire
router.patch('/:id/status', updateMemoireStatus);

// Mettre à jour un mémoire (ETUDIANT propriétaire uniquement)
router.put('/:id', checkRole(['ADMIN', 'ETUDIANT', 'ENCADREUR']), updateMemoire);

// Ajouter un document au mémoire (ETUDIANT propriétaire uniquement)
import { upload } from '../middleware/uploadMiddleware';

// ... other routes above unchanged

// Ajouter un document au mémoire (upload fichier)
// Dépôt final du mémoire
router.post('/:id/depot-final', checkRole(['ETUDIANT']), upload.single('file'), uploadFinal);

// Validation par l'encadreur
router.post('/:id/validation-encadreur', checkRole(['ENCADREUR']), validateFinalByEncadreur);

// Validation finale par l'admin
router.post('/:id/validation-admin', checkRole(['ADMIN']), validateFinalByAdmin);

// Version intermédiaire (documents)
router.post('/:id/documents', checkRole(['ETUDIANT']), upload.single('file'), addDocument);

// Commenter une version (encadreur)
router.patch('/documents/:docId/comment', checkRole(['ENCADREUR']), updateDocumentComment);

export default router; 