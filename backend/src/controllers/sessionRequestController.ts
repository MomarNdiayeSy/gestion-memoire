import { Request, Response } from 'express';
import { PrismaClient, SessionType } from '@prisma/client';

const prisma = new PrismaClient();

// Créer une demande de session (étudiant)
export const createRequest = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    const role = req.user?.role;
    if (role !== 'ETUDIANT') {
      return res.status(403).json({ message: 'Seul un étudiant peut faire une demande' });
    }
    const { date, heure, type } = req.body as {
      date: string;
      heure: string;
      type: 'PRESENTIEL' | 'VIRTUEL';
    };
    const memoire = await prisma.memoire.findFirst({ where: { etudiantId: userId } });
    if (!memoire) {
      return res.status(400).json({ message: 'Aucun mémoire trouvé pour cet étudiant' });
    }
    const encadreurId = memoire.encadreurId;

    const requestData = await prisma.sessionRequest.create({
      data: {
        date: new Date(date),
        heure,
        type: type as SessionType,
        etudiantId: userId!,
        encadreurId,
      },
      include: {
        etudiant: { select: { nom: true, prenom: true } },
      },
    });

    // notification encadreur
    await prisma.notification.create({
      data: {
        titre: 'Nouvelle demande de session',
        message: `L\'étudiant ${requestData.etudiant.prenom} ${requestData.etudiant.nom} a demandé une session`,
        userId: encadreurId,
      },
    });

    res.status(201).json(requestData);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Erreur lors de la création de la demande' });
  }
};

// Obtenir les demandes (encadreur ou étudiant)
export const getRequests = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    const role = req.user?.role;

    const whereClause = role === 'ENCADREUR' ? { encadreurId: userId } : { etudiantId: userId };

    const list = await prisma.sessionRequest.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      include: {
        etudiant: { select: { nom: true, prenom: true } },
      },
    });
    res.json(list);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Erreur lors de la récupération des demandes' });
  }
};

// Mise à jour (encadreur accepte ou refuse)
export const updateRequest = async (req: Request, res: Response) => {
  try {
    const role = req.user?.role;
    const userId = req.user?.userId;
    if (role !== 'ENCADREUR') return res.status(403).json({ message: 'Non autorisé' });

    const { id } = req.params;
    const { statut, meetingLink, salle, duree } = req.body as { statut: 'ACCEPTEE' | 'REFUSEE'; meetingLink?: string; salle?: string; duree?: number };

    const request = await prisma.sessionRequest.findUnique({ where: { id } });
    if (!request) return res.status(404).json({ message: 'Demande non trouvée' });
    if (request.encadreurId !== userId) return res.status(403).json({ message: 'Non autorisé' });

    let createdSession = null;
    if (statut === 'ACCEPTEE') {
      if (request.type === 'VIRTUEL' && !meetingLink) {
        return res.status(400).json({ message: 'Le lien de réunion est requis pour une session virtuelle' });
      }
      if (request.type === 'PRESENTIEL' && !salle) {
        return res.status(400).json({ message: 'La salle est requise pour une session présentielle' });
      }
      const sessionDuration = duree ?? 60;
      // créer la session (réutilise logique simple)
      const numero = (await prisma.session.count({ where: { encadreurId: userId } })) + 1;
      createdSession = await prisma.session.create({
        data: {
          date: request.date,
          duree: sessionDuration,
          type: request.type,
          status: 'PLANIFIE',
          encadreurId: userId,
          meetingLink: request.type === 'VIRTUEL' ? meetingLink : undefined,
          salle: request.type === 'PRESENTIEL' ? salle : undefined,
          etudiantId: request.etudiantId,
          numero,
        },
      });
    }

    const updated = await prisma.sessionRequest.update({ where: { id }, data: { statut } });

    // notification à l'étudiant
    await prisma.notification.create({
      data: {
        titre: 'Demande de session mise à jour',
        message: statut === 'ACCEPTEE' ? 'Votre demande a été acceptée' : 'Votre demande a été refusée',
        userId: request.etudiantId,
      },
    });

    res.json({ request: updated, session: createdSession });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Erreur lors de la mise à jour' });
  }
};
