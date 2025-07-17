import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Nettoyer la base de données
  await prisma.historiqueMemoireStatus.deleteMany();
  await prisma.document.deleteMany();
  await prisma.jury.deleteMany();
  await prisma.memoire.deleteMany();
  await prisma.session.deleteMany();
  await prisma.sujet.deleteMany();
  await prisma.paiement.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.user.deleteMany();

  // Créer les utilisateurs
  const hashedPassword = await bcrypt.hash('password123', 10);

  // Admin
  const admin = await prisma.user.create({
    data: {
      email: 'admin@isi.edu',
      password: hashedPassword,
      nom: 'Admin',
      prenom: 'Super',
      role: 'ADMIN',
      telephone: '77123456'
    }
  });

  // Encadreurs
  const encadreur1 = await prisma.user.create({
    data: {
      email: 'ahmed.benali@isi.edu',
      password: hashedPassword,
      nom: 'Ben Ali',
      prenom: 'Ahmed',
      role: 'ENCADREUR',
      telephone: '77234567',
      specialite: 'Intelligence Artificielle'
    }
  });

  const encadreur2 = await prisma.user.create({
    data: {
      email: 'karim.nasri@isi.edu',
      password: hashedPassword,
      nom: 'Nasri',
      prenom: 'Karim',
      role: 'ENCADREUR',
      telephone: '77234568',
      specialite: 'Blockchain'
    }
  });

  const encadreur3 = await prisma.user.create({
    data: {
      email: 'sonia.mahmoud@isi.edu',
      password: hashedPassword,
      nom: 'Mahmoud',
      prenom: 'Sonia',
      role: 'ENCADREUR',
      telephone: '77234569',
      specialite: 'Cybersécurité'
    }
  });

  // Membres du jury supplémentaires
  const encadreur4 = await prisma.user.create({
    data: {
      email: 'mohamed.ali@isi.edu',
      password: hashedPassword,
      nom: 'Ali',
      prenom: 'Mohamed',
      role: 'ENCADREUR',
      telephone: '77234570',
      specialite: 'Data Science'
    }
  });

  const encadreur5 = await prisma.user.create({
    data: {
      email: 'leila.ben@isi.edu',
      password: hashedPassword,
      nom: 'Ben',
      prenom: 'Leila',
      role: 'ENCADREUR',
      telephone: '77234571',
      specialite: 'Réseaux'
    }
  });

  // Étudiants
  const etudiant1 = await prisma.user.create({
    data: {
      email: 'amine.trabelsi@isi.edu',
      password: hashedPassword,
      nom: 'Trabelsi',
      prenom: 'Amine',
      role: 'ETUDIANT',
      telephone: '77345678',
      matricule: 'ISI2024001'
    }
  });

  const etudiant2 = await prisma.user.create({
    data: {
      email: 'fatou.sow@isi.edu',
      password: hashedPassword,
      nom: 'Sow',
      prenom: 'Fatou',
      role: 'ETUDIANT',
      telephone: '77345679',
      matricule: 'ISI2024002'
    }
  });

  // Créer les sujets
  const sujet1 = await prisma.sujet.create({
    data: {
      titre: "Intelligence Artificielle et Machine Learning",
      description: "Développement d'un système de recommandation intelligent",
      status: "VALIDE",
      motsCles: ["IA", "Machine Learning", "Recommandation"],
      dateValidation: new Date("2024-01-15"),
      encadreurId: encadreur1.id
    }
  });

  const sujet2 = await prisma.sujet.create({
    data: {
      titre: "Blockchain et Cryptomonnaies",
      description: "Étude et implémentation d'un système de paiement décentralisé",
      status: "VALIDE",
      motsCles: ["Blockchain", "Cryptomonnaie", "DeFi"],
      dateValidation: new Date("2024-01-20"),
      encadreurId: encadreur2.id
    }
  });

  const sujet3 = await prisma.sujet.create({
    data: {
      titre: "Cybersécurité et Protection des Données",
      description: "Analyse des vulnérabilités dans les applications web",
      status: "VALIDE",
      motsCles: ["Sécurité", "Web", "Vulnérabilités"],
      dateValidation: new Date("2024-01-20"),
      encadreurId: encadreur3.id
    }
  });

  // Créer les mémoires
  const memoire1 = await prisma.memoire.create({
    data: {
      titre: "Système de Recommandation basé sur l'IA",
      description: "Implémentation d'un système de recommandation utilisant des techniques de deep learning",
      status: "VALIDE",
      motsCles: ["IA", "Deep Learning", "Recommandation"],
      etudiantId: etudiant1.id,
      encadreurId: encadreur1.id,
      sujetId: sujet1.id,
      dateSoutenance: new Date("2024-03-15")
    }
  });

  const memoire2 = await prisma.memoire.create({
    data: {
      titre: "Système de Paiement Décentralisé",
      description: "Implémentation d'un système de paiement utilisant la blockchain",
      status: "VALIDE",
      motsCles: ["Blockchain", "Paiement", "DeFi"],
      etudiantId: etudiant2.id,
      encadreurId: encadreur2.id,
      sujetId: sujet2.id,
      dateSoutenance: new Date("2024-03-20")
    }
  });

  // Créer les jurys
  const jury1 = await prisma.jury.create({
    data: {
      memoireId: memoire1.id,
      presidentId: encadreur3.id,
      rapporteurId: encadreur4.id,
      examinateurId: encadreur5.id,
      dateSoutenance: new Date("2024-03-15"),
      salle: "Salle A-101"
    }
  });

  const jury2 = await prisma.jury.create({
    data: {
      memoireId: memoire2.id,
      presidentId: encadreur4.id,
      rapporteurId: encadreur5.id,
      examinateurId: encadreur3.id,
      dateSoutenance: new Date("2024-03-20"),
      salle: "Salle B-202"
    }
  });

  // Créer une session
  await prisma.session.create({
    data: {
      date: new Date("2024-03-01T09:00:00Z"),
      duree: 60,
      status: "PLANIFIEE",
      rapport: "Première session de suivi",
      encadreurId: encadreur1.id,
      etudiantId: etudiant1.id
    }
  });

  // Créer des paiements
  await prisma.paiement.create({
    data: {
      montant: 50000,
      reference: "PAY-001",
      date: new Date(),
      status: "VALIDE",
      etudiantId: etudiant1.id
    }
  });

  await prisma.paiement.create({
    data: {
      montant: 50000,
      reference: "PAY-002",
      date: new Date(),
      status: "EN_ATTENTE",
      etudiantId: etudiant2.id
    }
  });

  // Créer des notifications
  await prisma.notification.create({
    data: {
      titre: "Paiement validé",
      message: "Votre paiement a été validé avec succès",
      userId: etudiant1.id
    }
  });

  await prisma.notification.create({
    data: {
      titre: "Nouveau sujet disponible",
      message: "Un nouveau sujet a été ajouté dans votre domaine",
      userId: etudiant2.id
    }
  });

  console.log('Base de données initialisée avec succès');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 