import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Obtenir toutes les notifications d'un utilisateur
export const getNotifications = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;

    const notifications = await prisma.notification.findMany({
      where: {
        userId: userId!
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json(notifications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de la récupération des notifications" });
  }
};

// Marquer une notification comme lue
export const markAsRead = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;

    const notification = await prisma.notification.findUnique({
      where: { id }
    });

    if (!notification) {
      return res.status(404).json({ message: "Notification non trouvée" });
    }

    if (notification.userId !== userId) {
      return res.status(403).json({ message: "Accès non autorisé" });
    }

    const updatedNotification = await prisma.notification.update({
      where: { id },
      data: { lu: true }
    });

    res.json(updatedNotification);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de la mise à jour de la notification" });
  }
};

// Marquer toutes les notifications comme lues
export const markAllAsRead = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;

    await prisma.notification.updateMany({
      where: {
        userId: userId!,
        lu: false
      },
      data: {
        lu: true
      }
    });

    res.json({ message: "Toutes les notifications ont été marquées comme lues" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de la mise à jour des notifications" });
  }
};

// Supprimer une notification
export const deleteNotification = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;

    const notification = await prisma.notification.findUnique({
      where: { id }
    });

    if (!notification) {
      return res.status(404).json({ message: "Notification non trouvée" });
    }

    if (notification.userId !== userId) {
      return res.status(403).json({ message: "Accès non autorisé" });
    }

    await prisma.notification.delete({
      where: { id }
    });

    res.json({ message: "Notification supprimée avec succès" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de la suppression de la notification" });
  }
}; 