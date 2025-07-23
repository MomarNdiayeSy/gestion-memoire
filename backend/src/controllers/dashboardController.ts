import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * GET /admin/dashboard/stats
 * Returns global counts for the admin dashboard.
 */
export const getStats = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate } = req.query as { startDate?: string; endDate?: string };
    const whereCreated: any = {};
    const whereDate: any = {};
    if (startDate) {
      const sd = new Date(startDate);
      whereCreated.gte = sd;
      whereDate.gte = sd;
    }
    if (endDate) {
      const ed = new Date(endDate);
      whereCreated.lte = ed;
      whereDate.lte = ed;
    }

    const [users, memoires, jurys, paiements] = await Promise.all([
      prisma.user.count({ where: { role: 'ETUDIANT', ...(Object.keys(whereCreated).length ? { createdAt: whereCreated } : {}) } }),
      prisma.memoire.count({ where: Object.keys(whereCreated).length ? { createdAt: whereCreated } : undefined }),
      prisma.jury.count({ where: Object.keys(whereDate).length ? { dateSoutenance: whereDate } : undefined }),
      prisma.paiement.aggregate({ _sum: { montant: true }, where: Object.keys(whereDate).length ? { date: whereDate } : undefined }),
    ]);

    res.json({ users, memoires, jurys, montant: paiements._sum.montant || 0 });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

/**
 * GET /admin/dashboard/activities
 * Returns the latest activities (simple union of recent records).
 */
export const getRecentActivities = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate } = req.query as { startDate?: string; endDate?: string };
    const whereCreated: any = {};
    if (startDate) whereCreated.gte = new Date(startDate);
    if (endDate) whereCreated.lte = new Date(endDate);

    // Fetch last 5 items from each entity, then merge & sort by date desc
    const [lastUsers, lastPaiements, lastJurys] = await Promise.all([
      prisma.user.findMany({ where: Object.keys(whereCreated).length ? { createdAt: whereCreated } : undefined, orderBy: { createdAt: 'desc' }, take: 5 }),
      prisma.paiement.findMany({ where: Object.keys(whereCreated).length ? { createdAt: whereCreated } : undefined, orderBy: { createdAt: 'desc' }, take: 5, include: { etudiant: true } }),
      prisma.jury.findMany({ where: Object.keys(whereCreated).length ? { createdAt: whereCreated } : undefined, orderBy: { createdAt: 'desc' }, take: 5 }),
    ]);

    const activities: any[] = [];

    lastUsers.forEach((u: any) => activities.push({
      type: 'user',
      message: `Nouvel utilisateur ajouté`,
      details: `${u.prenom} ${u.nom}`,
      createdAt: u.createdAt,
    }));

    lastPaiements.forEach((p: any) => activities.push({
      type: 'payment',
      message: 'Paiement reçu',
      details: `${p.montant.toLocaleString()} FCFA - ${p.etudiant?.prenom || ''} ${p.etudiant?.nom || ''}`.trim(),
      createdAt: p.createdAt,
    }));

    lastJurys.forEach((j: any) => activities.push({
      type: 'jury',
      message: 'Jury programmé',
      details: `Jury ID ${j.id}`,
      createdAt: j.createdAt,
    }));

    activities.sort((a, b) => (b.createdAt as any) - (a.createdAt as any));

    res.json(activities.slice(0, 10));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

/**
 * GET /admin/dashboard/events
 * Returns upcoming events (jury with future date, etc.)
 */
export const getUpcomingEvents = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate } = req.query as { startDate?: string; endDate?: string };
    const now = new Date();
    const dateFilter: any = { gte: startDate ? new Date(startDate) : now };
    if (endDate) dateFilter.lte = new Date(endDate);

    const jurys = await prisma.jury.findMany({
      where: { dateSoutenance: dateFilter },
      orderBy: { dateSoutenance: 'asc' },
      take: 10,
    });

    const events = jurys.map((j: any) => ({
      title: 'Soutenance de Mémoire',
      date: j.dateSoutenance.toLocaleDateString('fr-FR'),
      time: j.dateSoutenance.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      location: j.salle,
      status: j.statut || 'Planifié',
    }));

    res.json(events);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};
