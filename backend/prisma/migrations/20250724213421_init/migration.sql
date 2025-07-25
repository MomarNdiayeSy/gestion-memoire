-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'ENCADREUR', 'ETUDIANT');

-- CreateEnum
CREATE TYPE "MemoireStatus" AS ENUM ('EN_COURS', 'SOUMIS', 'EN_REVISION', 'VALIDE', 'REJETE', 'SOUTENU');

-- CreateEnum
CREATE TYPE "SujetStatus" AS ENUM ('EN_ATTENTE', 'VALIDE', 'REJETE', 'ATTRIBUE');

-- CreateEnum
CREATE TYPE "SessionStatus" AS ENUM ('PLANIFIEE', 'EFFECTUEE', 'ANNULEE');

-- CreateEnum
CREATE TYPE "PaiementStatus" AS ENUM ('EN_ATTENTE', 'VALIDE', 'REJETE');

-- CreateEnum
CREATE TYPE "JuryStatus" AS ENUM ('PLANIFIE', 'TERMINE', 'ANNULE');

-- CreateEnum
CREATE TYPE "SessionType" AS ENUM ('PRESENTIEL', 'VIRTUEL');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('ESPECE', 'ORANGE_MONEY', 'WAVE', 'YAS');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "prenom" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "specialite" TEXT,
    "matricule" TEXT,
    "telephone" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Memoire" (
    "id" TEXT NOT NULL,
    "titre" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "fichierUrl" TEXT,
    "motsCles" TEXT[],
    "dateDepot" TIMESTAMP(3),
    "dateSoutenance" TIMESTAMP(3),
    "note" DOUBLE PRECISION,
    "mention" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "progression" INTEGER NOT NULL DEFAULT 0,
    "etudiantId" TEXT NOT NULL,
    "encadreurId" TEXT NOT NULL,
    "sujetId" TEXT NOT NULL,

    CONSTRAINT "Memoire_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sujet" (
    "id" TEXT NOT NULL,
    "titre" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "motsCles" TEXT[],
    "dateValidation" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "encadreurId" TEXT NOT NULL,

    CONSTRAINT "Sujet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "duree" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "type" "SessionType" NOT NULL DEFAULT 'PRESENTIEL',
    "rapport" TEXT,
    "remarques" TEXT,
    "visaEncadreur" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "encadreurId" TEXT NOT NULL,
    "etudiantId" TEXT NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Document" (
    "id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "memoireId" TEXT NOT NULL,

    CONSTRAINT "Document_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Jury" (
    "id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "dateSoutenance" TIMESTAMP(3) NOT NULL,
    "salle" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "statut" "JuryStatus" NOT NULL DEFAULT 'PLANIFIE',
    "memoireId" TEXT NOT NULL,
    "encadreurJury1Id" TEXT NOT NULL,
    "encadreurJury2Id" TEXT NOT NULL,
    "encadreurJury3Id" TEXT NOT NULL,

    CONSTRAINT "Jury_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Paiement" (
    "id" TEXT NOT NULL,
    "montant" DOUBLE PRECISION NOT NULL,
    "reference" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'EN_ATTENTE',
    "methode" "PaymentMethod" NOT NULL DEFAULT 'ESPECE',
    "etudiantId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Paiement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "titre" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "lu" BOOLEAN NOT NULL DEFAULT false,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HistoriqueMemoireStatus" (
    "id" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "commentaire" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "memoireId" TEXT NOT NULL,

    CONSTRAINT "HistoriqueMemoireStatus_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Memoire_etudiantId_key" ON "Memoire"("etudiantId");

-- CreateIndex
CREATE UNIQUE INDEX "Jury_memoireId_key" ON "Jury"("memoireId");

-- AddForeignKey
ALTER TABLE "Memoire" ADD CONSTRAINT "Memoire_etudiantId_fkey" FOREIGN KEY ("etudiantId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Memoire" ADD CONSTRAINT "Memoire_encadreurId_fkey" FOREIGN KEY ("encadreurId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Memoire" ADD CONSTRAINT "Memoire_sujetId_fkey" FOREIGN KEY ("sujetId") REFERENCES "Sujet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sujet" ADD CONSTRAINT "Sujet_encadreurId_fkey" FOREIGN KEY ("encadreurId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_encadreurId_fkey" FOREIGN KEY ("encadreurId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_etudiantId_fkey" FOREIGN KEY ("etudiantId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_memoireId_fkey" FOREIGN KEY ("memoireId") REFERENCES "Memoire"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Jury" ADD CONSTRAINT "Jury_memoireId_fkey" FOREIGN KEY ("memoireId") REFERENCES "Memoire"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Jury" ADD CONSTRAINT "Jury_encadreurJury1Id_fkey" FOREIGN KEY ("encadreurJury1Id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Jury" ADD CONSTRAINT "Jury_encadreurJury2Id_fkey" FOREIGN KEY ("encadreurJury2Id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Jury" ADD CONSTRAINT "Jury_encadreurJury3Id_fkey" FOREIGN KEY ("encadreurJury3Id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Paiement" ADD CONSTRAINT "Paiement_etudiantId_fkey" FOREIGN KEY ("etudiantId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HistoriqueMemoireStatus" ADD CONSTRAINT "HistoriqueMemoireStatus_memoireId_fkey" FOREIGN KEY ("memoireId") REFERENCES "Memoire"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
