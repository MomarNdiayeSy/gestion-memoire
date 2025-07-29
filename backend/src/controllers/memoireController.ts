import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Obtenir le mémoire de l'étudiant connecté
export const getMyMemoire = async (req: Request, res: Response) => {
  try {
    const etudiantId = req.user?.userId;
    const memoire = await prisma.memoire.findUnique({
      where: { etudiantId: etudiantId },
      include: {
        sujet: true,
        documents: true,
        encadreur: {
          select: { nom: true, prenom: true }
        }
      }
    });

    if (!memoire) {
      return res.status(404).json({ message: 'Mémoire non trouvé' });
    }

    res.json(memoire);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la récupération du mémoire' });
  }
};

// Créer un nouveau mémoire
export const createMemoire = async (req: Request, res: Response) => {
  try {
    const { titre, description, motsCles, sujetId } = req.body;
    const etudiantId = req.user?.userId;

    // Vérifier si l'étudiant a déjà un mémoire
    const existingMemoire = await prisma.memoire.findUnique({
      where: { etudiantId: etudiantId }
    });

    if (existingMemoire) {
      return res.status(400).json({ message: "Vous avez déjà un mémoire en cours" });
    }

    // Récupérer le sujet pour vérifier l'encadreur
    const sujet = await prisma.sujet.findUnique({
      where: { id: sujetId }
    });

    if (!sujet) {
      return res.status(404).json({ message: "Sujet non trouvé" });
    }

    // Créer le mémoire
    const memoire = await prisma.memoire.create({
      data: {
        titre,
        description,
        motsCles,
        status: "EN_COURS",
        etudiantId: etudiantId!,
        encadreurId: sujet.encadreurId,
        sujetId
      }
    });

    // Créer l'historique
    await prisma.historiqueMemoireStatus.create({
      data: {
        status: "EN_COURS",
        commentaire: "Création du mémoire",
        memoireId: memoire.id
      }
    });

    // Créer une notification pour l'encadreur
    await prisma.notification.create({
      data: {
        titre: "Nouveau mémoire",
        message: `Un nouveau mémoire a été créé pour votre sujet "${sujet.titre}"`,
        userId: sujet.encadreurId
      }
    });

    res.status(201).json(memoire);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de la création du mémoire" });
  }
};

// Obtenir tous les mémoires
export const getMemoires = async (req: Request, res: Response) => {
  try {
    const userRole = req.user?.role;
    const userId = req.user?.userId;
    const { status } = req.query;

    let whereClause: any = {};
    if (status) {
      whereClause.status = status;
    }

    if (userRole === 'ENCADREUR') {
      whereClause.encadreurId = userId;
    } else if (userRole === 'ETUDIANT') {
      whereClause.etudiantId = userId;
    }

    const memoires = await prisma.memoire.findMany({
      where: whereClause,
      include: {
        etudiant: {
          select: {
            nom: true,
            prenom: true,
            email: true
          }
        },
        encadreur: {
          select: {
            nom: true,
            prenom: true
          }
        },
        sujet: true,
        documents: true,
        historique: {
          orderBy: {
            createdAt: 'desc'
          }
        }
      },
      orderBy: {
        updatedAt: 'desc'
      }
    });

    res.json(memoires);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de la récupération des mémoires" });
  }
};

// Obtenir un mémoire par ID
export const getMemoireById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userRole = req.user?.role;
    const userId = req.user?.userId;

    const memoire = await prisma.memoire.findUnique({
      where: { id },
      include: {
        etudiant: {
          select: {
            nom: true,
            prenom: true,
            email: true
          }
        },
        encadreur: {
          select: {
            nom: true,
            prenom: true
          }
        },
        sujet: true,
        documents: true,
        historique: {
          orderBy: {
            createdAt: 'desc'
          }
        },
        jury: {
          include: {
            encadreurJury1: true,
            encadreurJury2: true,
            encadreurJury3: true
          }
        }
      }
    });

    if (!memoire) {
      return res.status(404).json({ message: "Mémoire non trouvé" });
    }

    // Vérifier les permissions
    if (userRole !== 'ADMIN' && 
        userId !== memoire.etudiantId && 
        userId !== memoire.encadreurId) {
      return res.status(403).json({ message: "Accès non autorisé" });
    }

    res.json(memoire);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de la récupération du mémoire" });
  }
};

// Mettre à jour le statut d'un mémoire
export const updateMemoireStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, commentaire } = req.body;
    const userRole = req.user?.role;
    const userId = req.user?.userId;

    const memoire = await prisma.memoire.findUnique({
      where: { id },
      include: {
        etudiant: true,
        encadreur: true
      }
    });

    if (!memoire) {
      return res.status(404).json({ message: "Mémoire non trouvé" });
    }

    // Vérifier les permissions selon le rôle et le statut demandé
    if (userRole === 'ETUDIANT' && status !== 'SOUMIS') {
      return res.status(403).json({ message: "Vous ne pouvez que soumettre le mémoire" });
    }

    if (userRole === 'ENCADREUR' && 
        userId !== memoire.encadreurId && 
        !['EN_REVISION', 'VALIDE', 'REJETE'].includes(status)) {
      return res.status(403).json({ message: "Action non autorisée" });
    }

    // Mettre à jour le statut
    const updatedMemoire = await prisma.memoire.update({
      where: { id },
      data: {
        status,
        ...(status === 'VALIDE' || status === 'SOUTENU' ? { progression: 100 } : {}),
        ...(status === 'REJETE' ? { progression: 0 } : {})
      }
    });

    // Créer l'historique
    await prisma.historiqueMemoireStatus.create({
      data: {
        status,
        commentaire,
        memoireId: id
      }
    });

    // Créer une notification
    const notificationMessage = `Le statut de votre mémoire "${memoire.titre}" a été mis à jour en "${status}"`;
    await prisma.notification.create({
      data: {
        titre: "Mise à jour du statut",
        message: notificationMessage,
        userId: memoire.etudiantId
      }
    });

    res.json(updatedMemoire);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de la mise à jour du statut" });
  }
};

// Mettre à jour un mémoire
export const updateMemoire = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { titre, description, motsCles, dateDepot, dateSoutenance, status, progression } = req.body;
    const userId = req.user?.userId;
    const userRole = req.user?.role;

    const memoire = await prisma.memoire.findUnique({
      where: { id }
    });

    if (!memoire) {
      return res.status(404).json({ message: "Mémoire non trouvé" });
    }

    // Vérifier les permissions : l'étudiant propriétaire peut modifier son mémoire, l'ADMIN aussi
    if (userRole !== 'ADMIN' && userId !== memoire.etudiantId && userId !== memoire.encadreurId) {
      return res.status(403).json({ message: "Action non autorisée" });
    }

    // Vérifier que le mémoire est modifiable (sauf pour ADMIN)
    if (['VALIDE', 'SOUTENU'].includes(memoire.status) && userRole !== 'ADMIN') {
      return res.status(400).json({ message: "Ce mémoire ne peut plus être modifié" });
    }

    // Préparer le payload de mise à jour
    const payload: any = {};
    if (titre !== undefined) payload.titre = titre;
    if (description !== undefined) payload.description = description;
    if (motsCles !== undefined) payload.motsCles = motsCles;
    if (dateDepot !== undefined) payload.dateDepot = dateDepot ? new Date(dateDepot) : null;
    if (dateSoutenance !== undefined) payload.dateSoutenance = dateSoutenance ? new Date(dateSoutenance) : null;
    if (status !== undefined) payload.status = status;
    if (progression !== undefined) payload.progression = progression;

    const updatedMemoire = await prisma.memoire.update({
      where: { id },
      data: payload
    });

    res.json(updatedMemoire);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la mise à jour du mémoire' });
  }
};

// Ajouter un document au mémoire (upload fichier)
// Dépôt de la version finale par l'étudiant
export const uploadFinal = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user?.userId;
    const file = (req as any).file as Express.Multer.File;
    const commentaire = (req.body.commentaire as string) || '';

    if (!file) return res.status(400).json({ message: 'Aucun fichier fourni' });

    // Vérifier que l'utilisateur est l'étudiant propriétaire
    const memoire = await prisma.memoire.findUnique({ where: { id } });
    if (!memoire) return res.status(404).json({ message: 'Mémoire non trouvé' });
    if (userId !== memoire.etudiantId)
      return res.status(403).json({ message: 'Non autorisé' });

    // Mise à jour du mémoire avec le fichier final et dateDepot
    const updated = await prisma.memoire.update({
      where: { id },
      data: {
        fichierUrl: `${req.protocol}://${req.get('host')}/uploads/${file.filename}`,
        dateDepot: new Date(),
        status: 'SOUMIS_FINAL',
      },
    });

    // TODO: créer notification pour l'encadreur

    res.status(200).json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors du dépôt final" });
  }
};

// Validation du mémoire final par l'encadreur
export const validateFinalByEncadreur = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user?.userId;
    const { action, commentaire = '' } = req.body as { action: 'ACCEPTE' | 'REFUSE'; commentaire?: string };

    const memoire = await prisma.memoire.findUnique({ where: { id } });
    if (!memoire) return res.status(404).json({ message: 'Mémoire non trouvé' });
    if (userId !== memoire.encadreurId)
      return res.status(403).json({ message: 'Non autorisé' });

    let newStatus = memoire.status;
    if (action === 'ACCEPTE') newStatus = 'VALIDE_ENCADREUR';
    else if (action === 'REFUSE') newStatus = 'EN_REVISION';

    const updated = await prisma.memoire.update({
      where: { id },
      data: { status: newStatus },
    });

    // TODO: historique + notification

    res.json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur validation encadreur' });
  }
};

// Validation finale par l'admin
export const validateFinalByAdmin = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { action } = req.body as { action: 'ACCEPTE' | 'REFUSE' };

    const memoire = await prisma.memoire.findUnique({ where: { id } });
    if (!memoire) return res.status(404).json({ message: 'Mémoire non trouvé' });

    let newStatus = memoire.status;
    if (action === 'ACCEPTE') newStatus = 'VALIDE_ADMIN';
    else if (action === 'REFUSE') newStatus = 'EN_REVISION';

    const updated = await prisma.memoire.update({ where: { id }, data: { status: newStatus } });

    // TODO: historique + notification

    res.json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur validation admin' });
  }
};

// --------------------------------------
// Encadreur: ajouter / mettre à jour le commentaire d'un document (version)
// PATCH /documents/:docId/comment { commentaire: string }
export const updateDocumentComment = async (req: Request, res: Response) => {
  try {
    const { docId } = req.params as { docId: string };
    const { commentaire = '' } = req.body as { commentaire: string };
    const encadreurId = (req as any).user?.userId;

    // Récupérer le document avec son mémoire
    const document = await prisma.document.findUnique({
      where: { id: docId },
      include: { memoire: true },
    });

    if (!document) return res.status(404).json({ message: 'Document non trouvé' });

    if (document.memoire.encadreurId !== encadreurId) {
      return res.status(403).json({ message: 'Non autorisé' });
    }

    const updatedDoc = await prisma.document.update({
      where: { id: docId },
      data: { commentaire },
    });

    // TODO: notification à l'étudiant

    res.json(updatedDoc);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de la mise à jour du commentaire" });
  }

};

export const addDocument = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { numero = '1', description = '' } = req.body;
    const userId = (req as any).user?.userId;
    const file = (req as any).file as Express.Multer.File;

    if (!file) return res.status(400).json({ message: 'Aucun fichier fourni' });

    const memoire = await prisma.memoire.findUnique({ where: { id } });
    if (!memoire) return res.status(404).json({ message: 'Mémoire non trouvé' });
    if (userId !== memoire.etudiantId)
      return res.status(403).json({ message: 'Non autorisé' });

    const document = await prisma.document.create({
      data: {
        numero: numero.toString(),
        description,
        commentaire: '',
        fichierUrl: `${req.protocol}://${req.get('host')}/uploads/${file.filename}`,
        memoireId: id,
      },
    });

    res.status(201).json(document);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de l'ajout du document" });
  }
};
