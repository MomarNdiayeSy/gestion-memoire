import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Publier un mémoire (ADMIN uniquement)
export const publishMemoire = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const role = (req as any).user?.role;
    if (role !== 'ADMIN') return res.status(403).json({ message: 'Non autorisé' });

    const memoire = await prisma.memoire.findUnique({ where: { id } });
    if (!memoire) return res.status(404).json({ message: 'Mémoire non trouvé' });
    if (memoire.status !== 'SOUTENU') {
      return res.status(400).json({ message: 'Seuls les mémoires soutenus peuvent être publiés' });
    }
    if (memoire.published) {
      return res.status(400).json({ message: 'Mémoire déjà publié' });
    }

    const updated = await prisma.memoire.update({ where: { id }, data: { published: true } });

    // Créer des notifications pour l'étudiant et l'encadreur
    await prisma.notification.createMany({
      data: [
        {
          titre: 'Mémoire publié',
          message: `Votre mémoire "${memoire.titre}" est maintenant disponible dans la bibliothèque`,
          userId: memoire.etudiantId,
        },
        {
          titre: 'Mémoire publié',
          message: `Le mémoire de votre étudiant a été publié dans la bibliothèque`,
          userId: memoire.encadreurId,
        },
      ],
    });

    res.json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la publication du mémoire' });
  }
};

// Bibliothèque : lister les mémoires publiés
export const getPublishedMemoires = async (req: Request, res: Response) => {
  try {
    const { search, year, encadreurId } = req.query as {
      search?: string;
      year?: string;
      encadreurId?: string;
    };

    const whereClause: any = { published: true, status: 'SOUTENU' };

    if (search) {
      whereClause.OR = [
        { titre: { contains: search, mode: 'insensitive' } },
        { motsCles: { hasSome: search.split(' ') } },
        { etudiant: { nom: { contains: search, mode: 'insensitive' } } },
      ];
    }

    if (year) {
      const start = new Date(`${year}-01-01`);
      const end = new Date(`${year}-12-31`);
      whereClause.dateSoutenance = { gte: start, lte: end };
    }

    if (encadreurId) whereClause.encadreurId = encadreurId;

    const list = await prisma.memoire.findMany({
      where: whereClause,
      include: {
        etudiant: { select: { nom: true, prenom: true } },
        encadreur: { select: { nom: true, prenom: true } },
      },
      orderBy: { dateSoutenance: 'desc' },
    });

    res.json(list);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la récupération de la bibliothèque' });
  }
};
