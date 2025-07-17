import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Créer une nouvelle session
export const createSession = async (req: Request, res: Response) => {
  try {
    const { date, duree, etudiantId } = req.body;
    const encadreurId = req.user?.userId;

    // Vérifier si l'étudiant existe et est encadré par cet encadreur
    const memoire = await prisma.memoire.findFirst({
      where: {
        etudiantId: etudiantId,
        encadreurId: encadreurId
      }
    });

    if (!memoire) {
      return res.status(400).json({ message: "Vous n'encadrez pas cet étudiant" });
    }

    const session = await prisma.session.create({
      data: {
        date: new Date(date),
        duree,
        status: "PLANIFIEE",
        encadreurId: encadreurId!,
        etudiantId
      },
      include: {
        encadreur: {
          select: {
            nom: true,
            prenom: true
          }
        },
        etudiant: {
          select: {
            nom: true,
            prenom: true,
            memoireEtudiant: {
              select: {
                id: true,
                titre: true
              }
            }
          }
        }
      }
    });

    // Créer une notification pour l'étudiant
    await prisma.notification.create({
      data: {
        titre: "Nouvelle session planifiée",
        message: `Une session de mentorat a été planifiée pour le ${new Date(date).toLocaleDateString()}`,
        userId: etudiantId
      }
    });

    res.status(201).json(session);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de la création de la session" });
  }
};

// Obtenir toutes les sessions
export const getSessions = async (req: Request, res: Response) => {
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

    const sessions = await prisma.session.findMany({
      where: whereClause,
      include: {
        encadreur: {
          select: {
            nom: true,
            prenom: true
          }
        },
        etudiant: {
          select: {
            nom: true,
            prenom: true,
            memoireEtudiant: {
              select: {
                id: true,
                titre: true
              }
            }
          }
        }
      },
      orderBy: {
        date: 'desc'
      }
    });

    res.json(sessions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de la récupération des sessions" });
  }
};

// Obtenir une session par ID
export const getSessionById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;
    const userRole = req.user?.role;

    const session = await prisma.session.findUnique({
      where: { id },
      include: {
        encadreur: {
          select: {
            nom: true,
            prenom: true,
            email: true
          }
        },
        etudiant: {
          select: {
            nom: true,
            prenom: true,
            email: true,
            memoireEtudiant: {
              select: {
                id: true,
                titre: true
              }
            }
          }
        }
      }
    });

    if (!session) {
      return res.status(404).json({ message: "Session non trouvée" });
    }

    // Vérifier les permissions
    if (userRole !== 'ADMIN' && 
        userId !== session.etudiantId && 
        userId !== session.encadreurId) {
      return res.status(403).json({ message: "Accès non autorisé" });
    }

    res.json(session);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de la récupération de la session" });
  }
};

// Mettre à jour une session
export const updateSession = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { date, duree, status, rapport, remarques } = req.body;
    const userId = req.user?.userId;

    const session = await prisma.session.findUnique({
      where: { id }
    });

    if (!session) {
      return res.status(404).json({ message: "Session non trouvée" });
    }

    // Vérifier que c'est bien l'encadreur
    if (userId !== session.encadreurId) {
      return res.status(403).json({ message: "Vous n'êtes pas autorisé à modifier cette session" });
    }

    const updatedSession = await prisma.session.update({
      where: { id },
      data: {
        date: date ? new Date(date) : undefined,
        duree,
        status,
        rapport,
        remarques
      },
      include: {
        encadreur: {
          select: {
            nom: true,
            prenom: true
          }
        },
        etudiant: {
          select: {
            nom: true,
            prenom: true,
            memoireEtudiant: {
              select: {
                id: true,
                titre: true
              }
            }
          }
        }
      }
    });

    // Si le statut a changé, créer une notification pour l'étudiant
    if (status && status !== session.status) {
      await prisma.notification.create({
        data: {
          titre: "Mise à jour de la session",
          message: `Le statut de votre session du ${new Date(session.date).toLocaleDateString()} a été mis à jour en "${status}"`,
          userId: session.etudiantId
        }
      });
    }

    res.json(updatedSession);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de la mise à jour de la session" });
  }
};

// Supprimer une session
export const deleteSession = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;

    const session = await prisma.session.findUnique({
      where: { id }
    });

    if (!session) {
      return res.status(404).json({ message: "Session non trouvée" });
    }

    // Vérifier que c'est bien l'encadreur
    if (userId !== session.encadreurId) {
      return res.status(403).json({ message: "Vous n'êtes pas autorisé à supprimer cette session" });
    }

    // Vérifier que la session n'est pas déjà effectuée
    if (session.status === 'EFFECTUEE') {
      return res.status(400).json({ message: "Impossible de supprimer une session déjà effectuée" });
    }

    await prisma.session.delete({
      where: { id }
    });

    // Créer une notification pour l'étudiant
    await prisma.notification.create({
      data: {
        titre: "Session annulée",
        message: `La session prévue pour le ${new Date(session.date).toLocaleDateString()} a été annulée`,
        userId: session.etudiantId
      }
    });

    res.json({ message: "Session supprimée avec succès" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de la suppression de la session" });
  }
}; 