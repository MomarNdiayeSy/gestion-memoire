import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Créer un nouveau sujet (ENCADREUR uniquement)
export const createSujet = async (req: Request, res: Response) => {
  try {
    const { titre, description, motsCles } = req.body;
    const encadreurId = req.user?.userId;

    const sujet = await prisma.sujet.create({
      data: {
        titre,
        description,
        motsCles,
        status: "EN_ATTENTE",
        encadreurId: encadreurId!
      },
      include: {
        encadreur: {
          select: {
            nom: true,
            prenom: true,
            specialite: true
          }
        }
      }
    });

    res.status(201).json(sujet);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de la création du sujet" });
  }
};

// Obtenir tous les sujets avec filtres
export const getSujets = async (req: Request, res: Response) => {
  try {
    const { status, specialite } = req.query;
    const userRole = req.user?.role;
    const userId = req.user?.userId;

    let whereClause: any = {};

    // Filtrer par statut si spécifié
    if (status) {
      whereClause.status = status;
    }

    // Filtrer par spécialité si spécifié
    if (specialite) {
      whereClause.encadreur = {
        specialite: specialite
      };
    }

    // Si c'est un encadreur, ne montrer que ses sujets
    if (userRole === 'ENCADREUR') {
      whereClause.encadreurId = userId;
    }

    const sujets = await prisma.sujet.findMany({
      where: whereClause,
      include: {
        encadreur: {
          select: {
            nom: true,
            prenom: true,
            specialite: true
          }
        },
        memoires: {
          select: {
            id: true,
            etudiant: {
              select: {
                nom: true,
                prenom: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json(sujets);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de la récupération des sujets" });
  }
};

// Obtenir un sujet par ID
export const getSujetById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const sujet = await prisma.sujet.findUnique({
      where: { id },
      include: {
        encadreur: {
          select: {
            nom: true,
            prenom: true,
            specialite: true,
            email: true
          }
        },
        memoires: {
          include: {
            etudiant: {
              select: {
                nom: true,
                prenom: true,
                email: true
              }
            }
          }
        }
      }
    });

    if (!sujet) {
      return res.status(404).json({ message: "Sujet non trouvé" });
    }

    res.json(sujet);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de la récupération du sujet" });
  }
};

// Mettre à jour un sujet
export const updateSujet = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { titre, description, motsCles } = req.body;
    const userId = req.user?.userId;
    const userRole = req.user?.role;

    const sujet = await prisma.sujet.findUnique({
      where: { id },
      include: { memoires: true }
    });

    if (!sujet) {
      return res.status(404).json({ message: "Sujet non trouvé" });
    }

    // Vérifier les permissions
    if (userRole !== 'ADMIN' && userId !== sujet.encadreurId) {
      return res.status(403).json({ message: "Vous n'êtes pas autorisé à modifier ce sujet" });
    }

    // Vérifier si le sujet peut être modifié
    if (sujet.memoires.length > 0) {
      return res.status(400).json({ message: "Ce sujet ne peut pas être modifié car il est déjà attribué" });
    }

    const updatedSujet = await prisma.sujet.update({
      where: { id },
      data: {
        titre,
        description,
        motsCles
      },
      include: {
        encadreur: {
          select: {
            nom: true,
            prenom: true,
            specialite: true
          }
        }
      }
    });

    res.json(updatedSujet);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de la mise à jour du sujet" });
  }
};

// Mettre à jour le statut d'un sujet (ADMIN uniquement)
export const updateSujetStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const sujet = await prisma.sujet.findUnique({
      where: { id }
    });

    if (!sujet) {
      return res.status(404).json({ message: "Sujet non trouvé" });
    }

    const updatedSujet = await prisma.sujet.update({
      where: { id },
      data: {
        status,
        dateValidation: status === 'VALIDE' ? new Date() : null
      },
      include: {
        encadreur: {
          select: {
            nom: true,
            prenom: true,
            specialite: true
          }
        }
      }
    });

    // Créer une notification pour l'encadreur
    await prisma.notification.create({
      data: {
        titre: `Statut du sujet mis à jour`,
        message: `Votre sujet "${sujet.titre}" a été ${status.toLowerCase()}`,
        userId: sujet.encadreurId
      }
    });

    res.json(updatedSujet);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de la mise à jour du statut" });
  }
};

// Supprimer un sujet
export const deleteSujet = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;
    const userRole = req.user?.role;

    const sujet = await prisma.sujet.findUnique({
      where: { id },
      include: { memoires: true }
    });

    if (!sujet) {
      return res.status(404).json({ message: "Sujet non trouvé" });
    }

    // Vérifier les permissions
    if (userRole !== 'ADMIN' && userId !== sujet.encadreurId) {
      return res.status(403).json({ message: "Vous n'êtes pas autorisé à supprimer ce sujet" });
    }

    // Vérifier si le sujet peut être supprimé
    if (sujet.memoires.length > 0) {
      return res.status(400).json({ message: "Ce sujet ne peut pas être supprimé car il est déjà attribué" });
    }

    await prisma.sujet.delete({
      where: { id }
    });

    res.json({ message: "Sujet supprimé avec succès" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de la suppression du sujet" });
  }
}; 