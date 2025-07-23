import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Créer un nouveau paiement
export const createPaiement = async (req: Request, res: Response) => {
  try {
    let { montant, reference, date, methode } = req.body;
    // Auto-generate reference if missing
    if (!reference || reference.trim() === "") {
      const year = new Date().getFullYear();
      const startYear = new Date(`${year}-01-01T00:00:00Z`);
      const nextYear = new Date(`${year + 1}-01-01T00:00:00Z`);
      const count = await prisma.paiement.count({
        where: {
          date: {
            gte: startYear,
            lt: nextYear,
          },
        },
      });
      reference = `PAY-${year}-${String(count + 1).padStart(3, "0")}`;
    }
    let etudiantId = req.user?.userId;
    const userRole = req.user?.role;
    // Si l'admin fournit un etudiantId dans le body, l'utiliser
    if (userRole === 'ADMIN' && req.body.etudiantId) {
      etudiantId = req.body.etudiantId;
    }

    const paiement = await prisma.paiement.create({
      data: {
        montant,
        reference,
        date: new Date(date),
        methode: methode ?? 'ESPECE',
        status: 'EN_ATTENTE',
        etudiantId: etudiantId!
      },
      include: {
        etudiant: {
          select: {
            nom: true,
            prenom: true,
            email: true
          }
        }
      }
    });

    // Créer une notification pour l'admin
    await prisma.notification.create({
      data: {
        titre: "Nouveau paiement à valider",
        message: `Un nouveau paiement de ${montant} CFA a été soumis par ${paiement.etudiant.prenom} ${paiement.etudiant.nom}`,
        userId: (await prisma.user.findFirst({ where: { role: 'ADMIN' } }))?.id!
      }
    });

    res.status(201).json(paiement);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de la création du paiement" });
  }
};

// Obtenir tous les paiements
export const getPaiements = async (req: Request, res: Response) => {
  try {
    const userRole = req.user?.role;
    const userId = req.user?.userId;
    const { status } = req.query;

    let whereClause: any = {};
    if (status) {
      whereClause.status = status;
    }

    if (userRole === 'ETUDIANT') {
      whereClause.etudiantId = userId;
    }

    const paiements = await prisma.paiement.findMany({
      where: whereClause,
      include: {
        etudiant: {
          select: {
            nom: true,
            prenom: true,
            email: true,
            matricule: true
          }
        }
      },
      orderBy: {
        date: 'desc'
      }
    });

    res.json(paiements);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de la récupération des paiements" });
  }
};

// Obtenir un paiement par ID
export const getPaiementById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;
    const userRole = req.user?.role;

    const paiement = await prisma.paiement.findUnique({
      where: { id },
      include: {
        etudiant: {
          select: {
            nom: true,
            prenom: true,
            email: true,
            matricule: true
          }
        }
      }
    });

    if (!paiement) {
      return res.status(404).json({ message: "Paiement non trouvé" });
    }

    // Vérifier les permissions
    if (userRole !== 'ADMIN' && userId !== paiement.etudiantId) {
      return res.status(403).json({ message: "Accès non autorisé" });
    }

    res.json(paiement);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de la récupération du paiement" });
  }
};

// Mettre à jour un paiement (admin uniquement)
export const updatePaiement = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userRole = req.user?.role;
    if (userRole !== 'ADMIN') {
      return res.status(403).json({ message: 'Seul un administrateur peut modifier un paiement' });
    }
    const { montant, reference, date, methode, status, etudiantId } = req.body;
    const data: any = {
      montant,
      reference,
      methode,
      status,
    };
    if (date) data.date = new Date(date);
    // Only set etudiantId if non-empty string provided
    if (etudiantId && typeof etudiantId === 'string' && etudiantId.trim() !== '') {
      data.etudiantId = etudiantId;
    }
    const paiement = await prisma.paiement.update({
      where: { id },
      data,
    });
    res.json(paiement);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la mise à jour du paiement' });
  }
};

// Mettre à jour le statut d'un paiement
export const updatePaiementStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const userRole = req.user?.role;

    if (userRole !== 'ADMIN') {
      return res.status(403).json({ message: "Seul un administrateur peut valider les paiements" });
    }

    const paiement = await prisma.paiement.update({
      where: { id },
      data: { status },
      include: {
        etudiant: {
          select: {
            id: true,
            nom: true,
            prenom: true,
            email: true
          }
        }
      }
    });

    // Créer une notification pour l'étudiant
    await prisma.notification.create({
      data: {
        titre: "Mise à jour du statut de paiement",
        message: `Votre paiement de ${paiement.montant} CFA a été ${status === 'VALIDE' ? 'validé' : 'rejeté'}`,
        userId: paiement.etudiantId
      }
    });

    res.json(paiement);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de la mise à jour du statut du paiement" });
  }
};

// Obtenir des statistiques de paiement
export const getPaiementStats = async (req: Request, res: Response) => {
  try {
    const userRole = req.user?.role;
    if (userRole !== 'ADMIN') {
      return res.status(403).json({ message: "Seul un administrateur peut consulter les statistiques de paiements" });
    }

    // Récupérer la somme des montants groupés par status
    const grouped = await prisma.paiement.groupBy({
      by: ['status'],
      _sum: {
        montant: true,
      },
    });

    const stats: Record<string, number> = {
      TOTAL: 0,
      VALIDE: 0,
      EN_ATTENTE: 0,
      REJETE: 0,
    };

    grouped.forEach(g => {
      const amount = g._sum.montant || 0;
      stats[g.status as 'VALIDE' | 'EN_ATTENTE' | 'REJETE'] = amount;
      stats.TOTAL += amount;
    });

    res.json(stats);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de la récupération des statistiques de paiement" });
  }
};

// Supprimer un paiement
export const deletePaiement = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userRole = req.user?.role;

    if (userRole !== 'ADMIN') {
      return res.status(403).json({ message: "Seul un administrateur peut supprimer les paiements" });
    }

    const paiement = await prisma.paiement.findUnique({
      where: { id },
      include: {
        etudiant: true
      }
    });

    if (!paiement) {
      return res.status(404).json({ message: "Paiement non trouvé" });
    }

    await prisma.paiement.delete({
      where: { id }
    });

    // Créer une notification pour l'étudiant
    await prisma.notification.create({
      data: {
        titre: "Paiement supprimé",
        message: `Votre paiement de ${paiement.montant} CFA a été supprimé`,
        userId: paiement.etudiantId
      }
    });

    res.json({ message: "Paiement supprimé avec succès" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de la suppression du paiement" });
  }
}; 