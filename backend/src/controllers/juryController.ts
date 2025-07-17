import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Créer un nouveau jury
export const createJury = async (req: Request, res: Response) => {
  try {
    const { memoireId, presidentId, rapporteurId, examinateurId, dateSoutenance, salle } = req.body;

    // Vérifier si un jury existe déjà pour ce mémoire
    const existingJury = await prisma.jury.findUnique({
      where: { memoireId }
    });

    if (existingJury) {
      return res.status(400).json({ message: "Un jury existe déjà pour ce mémoire" });
    }

    // Vérifier si le mémoire existe et est en état VALIDE
    const memoire = await prisma.memoire.findUnique({
      where: { id: memoireId }
    });

    if (!memoire || memoire.status !== 'VALIDE') {
      return res.status(400).json({ message: "Le mémoire doit être validé avant d'assigner un jury" });
    }

    const jury = await prisma.jury.create({
      data: {
        memoireId,
        presidentId,
        rapporteurId,
        examinateurId,
        dateSoutenance: new Date(dateSoutenance),
        salle
      },
      include: {
        memoire: {
          include: {
            etudiant: {
              select: {
                nom: true,
                prenom: true
              }
            }
          }
        },
        president: {
          select: {
            nom: true,
            prenom: true,
            specialite: true
          }
        },
        rapporteur: {
          select: {
            nom: true,
            prenom: true,
            specialite: true
          }
        },
        examinateur: {
          select: {
            nom: true,
            prenom: true,
            specialite: true
          }
        }
      }
    });

    // Mettre à jour le statut du mémoire
    await prisma.memoire.update({
      where: { id: memoireId },
      data: {
        status: 'SOUTENU',
        dateSoutenance: new Date(dateSoutenance)
      }
    });

    // Créer une notification pour l'étudiant
    await prisma.notification.create({
      data: {
        titre: "Jury de soutenance assigné",
        message: `Votre jury de soutenance a été assigné pour le ${new Date(dateSoutenance).toLocaleDateString()}`,
        userId: memoire.etudiantId
      }
    });

    res.status(201).json(jury);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de la création du jury" });
  }
};

// Obtenir tous les jurys
export const getJurys = async (req: Request, res: Response) => {
  try {
    const jurys = await prisma.jury.findMany({
      include: {
        memoire: {
          include: {
            etudiant: {
              select: {
                nom: true,
                prenom: true
              }
            }
          }
        },
        president: {
          select: {
            nom: true,
            prenom: true,
            specialite: true
          }
        },
        rapporteur: {
          select: {
            nom: true,
            prenom: true,
            specialite: true
          }
        },
        examinateur: {
          select: {
            nom: true,
            prenom: true,
            specialite: true
          }
        }
      },
      orderBy: {
        dateSoutenance: 'desc'
      }
    });

    res.json(jurys);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de la récupération des jurys" });
  }
};

// Obtenir un jury par ID
export const getJuryById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const jury = await prisma.jury.findUnique({
      where: { id },
      include: {
        memoire: {
          include: {
            etudiant: {
              select: {
                nom: true,
                prenom: true
              }
            }
          }
        },
        president: {
          select: {
            nom: true,
            prenom: true,
            specialite: true
          }
        },
        rapporteur: {
          select: {
            nom: true,
            prenom: true,
            specialite: true
          }
        },
        examinateur: {
          select: {
            nom: true,
            prenom: true,
            specialite: true
          }
        }
      }
    });

    if (!jury) {
      return res.status(404).json({ message: "Jury non trouvé" });
    }

    res.json(jury);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de la récupération du jury" });
  }
};

// Mettre à jour un jury
export const updateJury = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { presidentId, rapporteurId, examinateurId, dateSoutenance, salle } = req.body;

    const jury = await prisma.jury.update({
      where: { id },
      data: {
        presidentId,
        rapporteurId,
        examinateurId,
        dateSoutenance: new Date(dateSoutenance),
        salle
      },
      include: {
        memoire: {
          include: {
            etudiant: {
              select: {
                nom: true,
                prenom: true
              }
            }
          }
        },
        president: {
          select: {
            nom: true,
            prenom: true,
            specialite: true
          }
        },
        rapporteur: {
          select: {
            nom: true,
            prenom: true,
            specialite: true
          }
        },
        examinateur: {
          select: {
            nom: true,
            prenom: true,
            specialite: true
          }
        }
      }
    });

    // Mettre à jour la date de soutenance dans le mémoire
    await prisma.memoire.update({
      where: { id: jury.memoireId },
      data: {
        dateSoutenance: new Date(dateSoutenance)
      }
    });

    // Créer une notification pour l'étudiant
    await prisma.notification.create({
      data: {
        titre: "Modification du jury de soutenance",
        message: `Les informations de votre jury de soutenance ont été mises à jour pour le ${new Date(dateSoutenance).toLocaleDateString()}`,
        userId: jury.memoire.etudiantId
      }
    });

    res.json(jury);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de la mise à jour du jury" });
  }
};

// Supprimer un jury
export const deleteJury = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const jury = await prisma.jury.findUnique({
      where: { id },
      include: {
        memoire: true
      }
    });

    if (!jury) {
      return res.status(404).json({ message: "Jury non trouvé" });
    }

    // Supprimer le jury
    await prisma.jury.delete({
      where: { id }
    });

    // Mettre à jour le statut du mémoire
    await prisma.memoire.update({
      where: { id: jury.memoireId },
      data: {
        status: 'VALIDE',
        dateSoutenance: null
      }
    });

    // Créer une notification pour l'étudiant
    await prisma.notification.create({
      data: {
        titre: "Jury de soutenance annulé",
        message: "Votre jury de soutenance a été annulé. Un nouveau jury sera assigné prochainement.",
        userId: jury.memoire.etudiantId
      }
    });

    res.json({ message: "Jury supprimé avec succès" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de la suppression du jury" });
  }
}; 