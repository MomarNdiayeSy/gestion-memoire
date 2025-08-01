import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Créer une nouvelle session
export const createSession = async (req: Request, res: Response) => {
  try {
    const { duree, type, meetingLink, date, salle } = req.body as {
      duree: number;
      type: 'PRESENTIEL' | 'VIRTUEL';
      meetingLink?: string;
      salle?: string;
      date: string; // ISO string avec date et heure
    };
    const encadreurId = req.user?.userId;
    if (!encadreurId) return res.status(401).json({ message: 'Non autorisé' });

    // Récupérer les étudiants rattachés à cet encadreur (mémoires)
    const memoires = await prisma.memoire.findMany({
      where: { encadreurId },
      select: { etudiantId: true }
    });
    if (memoires.length === 0) {
      return res.status(400).json({ message: "Aucun étudiant rattaché à cet encadreur" });
    }

    // Validation des champs selon le type
    if (type === 'VIRTUEL') {
      if (!meetingLink) return res.status(400).json({ message: 'Le lien de réunion est requis pour une session virtuelle' });
      if (salle) return res.status(400).json({ message: 'La salle ne doit pas être renseignée pour une session virtuelle' });
    }
    if (type === 'PRESENTIEL') {
      if (!salle) return res.status(400).json({ message: 'La salle est requise pour une session présentielle' });
      if (meetingLink) return res.status(400).json({ message: 'Le lien ne doit pas être fourni pour une session présentielle' });
    }
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      return res.status(400).json({ message: 'Date invalide' });
    }

    // Limite de 10 séances : on compte les sessions existantes
    const existingCount = await prisma.session.count({ where: { encadreurId } });
    if (existingCount >= 10) {
      return res.status(400).json({ message: 'Limite de 10 séances atteinte' });
    }

    // Prochain numéro (par encadreur)
    const nextNumero = existingCount + 1;

    // Créer une session pour chaque étudiant
    const createdSessions = await prisma.$transaction(
      memoires.map((m) =>
        prisma.session.create({
          data: {
            date: parsedDate,
            duree,
            status: 'PLANIFIE',
            type,
            meetingLink,
            salle,
            numero: nextNumero,
            encadreurId,
            etudiantId: m.etudiantId
          },
          include: {
            encadreur: { select: { nom: true, prenom: true } },
            etudiant: {
              select: {
                nom: true,
                prenom: true,
                memoireEtudiant: { select: { id: true, titre: true } }
              }
            }
          }
        })
      )
    );

    // Notifications aux étudiants
    await prisma.notification.createMany({
      data: createdSessions.map((s) => ({
        titre: 'Nouvelle session planifiée',
        message: `Une session de mentorat a été planifiée pour le ${s.date.toLocaleDateString()}`,
        userId: s.etudiantId
      }))
    });

    res.status(201).json(createdSessions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la création de la session' });
  }
};

// --- Helper: Annuler les sessions dépassées (>24h)
const cancelExpiredSessions = async () => {
  const threshold = new Date(Date.now() - 24 * 60 * 60 * 1000);
  try {
    await prisma.session.updateMany({
      where: {
        status: { in: ['PLANIFIE', 'PLANIFIEE'] },
        date: { lt: threshold },
      },
      data: { status: 'ANNULEE' },
    });
  } catch (e) {
    console.error('Erreur auto-annulation sessions', e);
  }
};

// Obtenir toutes les sessions
export const getSessions = async (req: Request, res: Response) => {
  // Mise à jour automatique des sessions expirées
  await cancelExpiredSessions();
  try {
    const userRole = req.user?.role;
    const userId = req.user?.userId;
    const { status } = req.query;

    let whereClause: any = {};

    // Restreindre l'accès : seuls l'étudiant concerné ou son encadreur peuvent voir
    if (userRole !== 'ENCADREUR' && userRole !== 'ETUDIANT') {
      return res.status(403).json({ message: 'Accès interdit' });
    }
    if (status) {
      whereClause.status = status;
    }

    if (userRole === 'ENCADREUR') {
      whereClause.encadreurId = userId;
    } else if (userRole === 'ETUDIANT') {
      whereClause.etudiantId = userId;
    }

    const sessionsRaw = await prisma.session.findMany({
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

    const sessions = sessionsRaw.map((s: any) => ({
      ...s,
      memoireTitre: s.etudiant?.memoireEtudiant?.titre || '',
      statut: s.status
    }));

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
        userId !== session.encadreurId && 
        userId !== session.etudiantId) {
      return res.status(403).json({ message: "Accès non autorisé" });
    }

    const sessionData = {
      ...session,
      memoireTitre: session.etudiant?.memoireEtudiant?.titre || ''
    } as any;
    res.json(sessionData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de la récupération de la session" });
  }
};

// Mettre à jour une session
// Visa d'une session
export const visaSession = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { type } = req.body as { type: 'ENCADREUR' | 'ETUDIANT' };
    const userId = req.user?.userId;

    const session = await prisma.session.findUnique({ where: { id } });
    if (!session) return res.status(404).json({ message: 'Session non trouvée' });
    // Interdire le visa si la session est annulée
    if (session.status === 'ANNULEE') {
      return res.status(400).json({ message: 'Visa impossible sur une session annulée' });
    }

    // Vérification de l'auteur du visa
    if (type === 'ENCADREUR' && userId !== session.encadreurId) {
      return res.status(403).json({ message: "Seul l'encadreur peut signer ce visa" });
    }
    if (type === 'ETUDIANT' && userId !== session.etudiantId) {
      return res.status(403).json({ message: "Seul l'étudiant concerné peut signer ce visa" });
    }

    const updated = await prisma.session.update({
      where: { id },
      data: {
        visaEncadreur: type === 'ENCADREUR' ? true : session.visaEncadreur,
        visaEtudiant: type === 'ETUDIANT' ? true : session.visaEtudiant,
        // Terminer automatiquement si les deux visas sont vrais
        status: (type === 'ENCADREUR' ? true : session.visaEncadreur) && (type === 'ETUDIANT' ? true : session.visaEtudiant)
          ? 'TERMINE'
          : session.status
      }
    });

    res.json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la signature du visa' });
  }
};

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