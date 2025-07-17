import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// Mise à jour du profil utilisateur
export const updateProfile = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Non autorisé' });
    }

    const { nom, prenom, telephone, specialite, matricule } = req.body;

    // Récupérer l'utilisateur actuel pour vérifier son rôle
    const currentUser = await prisma.user.findUnique({
      where: { id: req.user.userId },
    });

    if (!currentUser) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    // Préparer les données de mise à jour en fonction du rôle
    const updateData: any = {
      nom,
      prenom,
      telephone,
    };

    // Ajouter les champs spécifiques selon le rôle
    if (currentUser.role === 'ENCADREUR' && specialite) {
      updateData.specialite = specialite;
    }
    if (currentUser.role === 'ETUDIANT' && matricule) {
      updateData.matricule = matricule;
    }

    // Mettre à jour l'utilisateur
    const updatedUser = await prisma.user.update({
      where: { id: req.user.userId },
      data: updateData,
    });

    // Supprimer le mot de passe de la réponse
    const { password: _, ...userWithoutPassword } = updatedUser;

    res.json({
      message: 'Profil mis à jour avec succès',
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du profil:', error);
    res.status(500).json({ message: 'Une erreur est survenue lors de la mise à jour du profil' });
  }
};

// Changement de mot de passe
export const changePassword = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Non autorisé' });
    }

    const { currentPassword, newPassword } = req.body;

    // Vérifier que les champs requis sont présents
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ 
        message: 'Le mot de passe actuel et le nouveau mot de passe sont requis' 
      });
    }

    // Récupérer l'utilisateur
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
    });

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    // Vérifier l'ancien mot de passe
    const validPassword = await bcrypt.compare(currentPassword, user.password);
    if (!validPassword) {
      return res.status(400).json({ message: 'Mot de passe actuel incorrect' });
    }

    // Hasher le nouveau mot de passe
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Mettre à jour le mot de passe
    await prisma.user.update({
      where: { id: req.user.userId },
      data: { password: hashedPassword },
    });

    res.json({ message: 'Mot de passe modifié avec succès' });
  } catch (error) {
    console.error('Erreur lors du changement de mot de passe:', error);
    res.status(500).json({ 
      message: 'Une erreur est survenue lors du changement de mot de passe' 
    });
  }
};

// Liste des utilisateurs avec filtrage par rôle
export const getUsers = async (req: Request, res: Response) => {
  try {
    if (!req.user || req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Accès non autorisé' });
    }

    const { role } = req.query;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    // Construire la requête avec les filtres
    const where: any = {};
    if (role) {
      where.role = role;
    }

    // Récupérer les utilisateurs et le compte total
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        select: {
          id: true,
          email: true,
          nom: true,
          prenom: true,
          role: true,
          specialite: true,
          matricule: true,
          telephone: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      prisma.user.count({ where }),
    ]);

    res.json({
      users,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        currentPage: page,
        perPage: limit,
      },
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des utilisateurs:', error);
    res.status(500).json({ message: 'Une erreur est survenue' });
  }
};

// Obtenir les détails d'un utilisateur spécifique
export const getUserById = async (req: Request, res: Response) => {
  try {
    if (!req.user || (req.user.role !== 'ADMIN' && req.user.userId !== req.params.id)) {
      return res.status(403).json({ message: 'Accès non autorisé' });
    }

    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
      select: {
        id: true,
        email: true,
        nom: true,
        prenom: true,
        role: true,
        specialite: true,
        matricule: true,
        telephone: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    res.json(user);
  } catch (error) {
    console.error('Erreur lors de la récupération des détails de l\'utilisateur:', error);
    res.status(500).json({ message: 'Une erreur est survenue' });
  }
};

// Liste des encadreurs disponibles
export const getEncadreurs = async (req: Request, res: Response) => {
  try {
    const encadreurs = await prisma.user.findMany({
      where: {
        role: 'ENCADREUR',
      },
      select: {
        id: true,
        nom: true,
        prenom: true,
        specialite: true,
        telephone: true,
        email: true,
      },
      orderBy: {
        nom: 'asc',
      },
    });

    res.json(encadreurs);
  } catch (error) {
    console.error('Erreur lors de la récupération des encadreurs:', error);
    res.status(500).json({ message: 'Une erreur est survenue' });
  }
};

// Liste des étudiants
export const getEtudiants = async (req: Request, res: Response) => {
  try {
    if (!req.user || (req.user.role !== 'ADMIN' && req.user.role !== 'ENCADREUR')) {
      return res.status(403).json({ message: 'Accès non autorisé' });
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const [etudiants, total] = await Promise.all([
      prisma.user.findMany({
        where: {
          role: 'ETUDIANT',
        },
        select: {
          id: true,
          nom: true,
          prenom: true,
          matricule: true,
          telephone: true,
          email: true,
          createdAt: true,
        },
        skip,
        take: limit,
        orderBy: {
          nom: 'asc',
        },
      }),
      prisma.user.count({
        where: {
          role: 'ETUDIANT',
        },
      }),
    ]);

    res.json({
      etudiants,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        currentPage: page,
        perPage: limit,
      },
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des étudiants:', error);
    res.status(500).json({ message: 'Une erreur est survenue' });
  }
}; 