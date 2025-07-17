/*
  Warnings:

  - You are about to drop the column `commentaire` on the `HistoriqueMemoireStatus` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `HistoriqueMemoireStatus` table. All the data in the column will be lost.
  - You are about to drop the column `dateSoutenance` on the `Jury` table. All the data in the column will be lost.
  - You are about to drop the column `examinateurId` on the `Jury` table. All the data in the column will be lost.
  - You are about to drop the column `presidentId` on the `Jury` table. All the data in the column will be lost.
  - You are about to drop the column `rapporteurId` on the `Jury` table. All the data in the column will be lost.
  - You are about to drop the column `dateDepot` on the `Memoire` table. All the data in the column will be lost.
  - You are about to drop the column `dateSoutenance` on the `Memoire` table. All the data in the column will be lost.
  - You are about to drop the column `encadreurId` on the `Memoire` table. All the data in the column will be lost.
  - You are about to drop the column `fichierUrl` on the `Memoire` table. All the data in the column will be lost.
  - You are about to drop the column `mention` on the `Memoire` table. All the data in the column will be lost.
  - You are about to drop the column `motsCles` on the `Memoire` table. All the data in the column will be lost.
  - You are about to drop the column `note` on the `Memoire` table. All the data in the column will be lost.
  - You are about to drop the column `lue` on the `Notification` table. All the data in the column will be lost.
  - You are about to drop the column `date` on the `Paiement` table. All the data in the column will be lost.
  - You are about to drop the column `rapport` on the `Session` table. All the data in the column will be lost.
  - You are about to drop the column `remarques` on the `Session` table. All the data in the column will be lost.
  - You are about to drop the column `visaEncadreur` on the `Session` table. All the data in the column will be lost.
  - You are about to drop the column `dateValidation` on the `Sujet` table. All the data in the column will be lost.
  - You are about to drop the `Document` table. If the table is not empty, all the data it contains will be lost.
  - Changed the type of `status` on the `HistoriqueMemoireStatus` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `date` to the `Jury` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `status` on the `Memoire` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `status` on the `Paiement` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `status` on the `Session` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `status` on the `Sujet` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `role` on the `User` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "Document" DROP CONSTRAINT "Document_memoireId_fkey";

-- DropForeignKey
ALTER TABLE "Jury" DROP CONSTRAINT "Jury_examinateurId_fkey";

-- DropForeignKey
ALTER TABLE "Jury" DROP CONSTRAINT "Jury_memoireId_fkey";

-- DropForeignKey
ALTER TABLE "Jury" DROP CONSTRAINT "Jury_presidentId_fkey";

-- DropForeignKey
ALTER TABLE "Jury" DROP CONSTRAINT "Jury_rapporteurId_fkey";

-- DropForeignKey
ALTER TABLE "Memoire" DROP CONSTRAINT "Memoire_encadreurId_fkey";

-- DropIndex
DROP INDEX "Jury_memoireId_key";

-- DropIndex
DROP INDEX "Memoire_etudiantId_key";

-- AlterTable
ALTER TABLE "HistoriqueMemoireStatus" DROP COLUMN "commentaire",
DROP COLUMN "createdAt",
ADD COLUMN     "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
DROP COLUMN "status",
ADD COLUMN     "status" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Jury" DROP COLUMN "dateSoutenance",
DROP COLUMN "examinateurId",
DROP COLUMN "presidentId",
DROP COLUMN "rapporteurId",
ADD COLUMN     "date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "note" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "Memoire" DROP COLUMN "dateDepot",
DROP COLUMN "dateSoutenance",
DROP COLUMN "encadreurId",
DROP COLUMN "fichierUrl",
DROP COLUMN "mention",
DROP COLUMN "motsCles",
DROP COLUMN "note",
ADD COLUMN     "fichier" TEXT,
ALTER COLUMN "description" DROP NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Notification" DROP COLUMN "lue",
ADD COLUMN     "lu" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Paiement" DROP COLUMN "date",
DROP COLUMN "status",
ADD COLUMN     "status" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Session" DROP COLUMN "rapport",
DROP COLUMN "remarques",
DROP COLUMN "visaEncadreur",
ADD COLUMN     "notes" TEXT,
DROP COLUMN "status",
ADD COLUMN     "status" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Sujet" DROP COLUMN "dateValidation",
DROP COLUMN "motsCles",
DROP COLUMN "status",
ADD COLUMN     "status" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "role",
ADD COLUMN     "role" TEXT NOT NULL;

-- DropTable
DROP TABLE "Document";

-- CreateTable
CREATE TABLE "_JuryToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_JuryToUser_AB_unique" ON "_JuryToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_JuryToUser_B_index" ON "_JuryToUser"("B");

-- AddForeignKey
ALTER TABLE "_JuryToUser" ADD CONSTRAINT "_JuryToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Jury"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_JuryToUser" ADD CONSTRAINT "_JuryToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Update NULL roles to 'ETUDIANT' as default
UPDATE "User" SET role = 'ETUDIANT' WHERE role IS NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "role" TYPE TEXT,
                    ALTER COLUMN "role" SET NOT NULL;
