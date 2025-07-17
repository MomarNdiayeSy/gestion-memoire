/*
  Warnings:

  - You are about to drop the column `date` on the `HistoriqueMemoireStatus` table. All the data in the column will be lost.
  - You are about to drop the column `date` on the `Jury` table. All the data in the column will be lost.
  - You are about to drop the column `note` on the `Jury` table. All the data in the column will be lost.
  - You are about to drop the column `fichier` on the `Memoire` table. All the data in the column will be lost.
  - You are about to drop the column `lu` on the `Notification` table. All the data in the column will be lost.
  - You are about to drop the column `notes` on the `Session` table. All the data in the column will be lost.
  - You are about to drop the `_JuryToUser` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[memoireId]` on the table `Jury` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[etudiantId]` on the table `Memoire` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `dateSoutenance` to the `Jury` table without a default value. This is not possible if the table is not empty.
  - Added the required column `examinateurId` to the `Jury` table without a default value. This is not possible if the table is not empty.
  - Added the required column `presidentId` to the `Jury` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rapporteurId` to the `Jury` table without a default value. This is not possible if the table is not empty.
  - Added the required column `encadreurId` to the `Memoire` table without a default value. This is not possible if the table is not empty.
  - Made the column `description` on table `Memoire` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `date` to the `Paiement` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_JuryToUser" DROP CONSTRAINT "_JuryToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_JuryToUser" DROP CONSTRAINT "_JuryToUser_B_fkey";

-- AlterTable
ALTER TABLE "HistoriqueMemoireStatus" DROP COLUMN "date",
ADD COLUMN     "commentaire" TEXT,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Jury" DROP COLUMN "date",
DROP COLUMN "note",
ADD COLUMN     "dateSoutenance" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "examinateurId" TEXT NOT NULL,
ADD COLUMN     "presidentId" TEXT NOT NULL,
ADD COLUMN     "rapporteurId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Memoire" DROP COLUMN "fichier",
ADD COLUMN     "dateDepot" TIMESTAMP(3),
ADD COLUMN     "dateSoutenance" TIMESTAMP(3),
ADD COLUMN     "encadreurId" TEXT NOT NULL,
ADD COLUMN     "fichierUrl" TEXT,
ADD COLUMN     "mention" TEXT,
ADD COLUMN     "motsCles" TEXT[],
ADD COLUMN     "note" DOUBLE PRECISION,
ALTER COLUMN "description" SET NOT NULL;

-- AlterTable
ALTER TABLE "Notification" DROP COLUMN "lu",
ADD COLUMN     "lue" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Paiement" ADD COLUMN     "date" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Session" DROP COLUMN "notes",
ADD COLUMN     "rapport" TEXT,
ADD COLUMN     "remarques" TEXT,
ADD COLUMN     "visaEncadreur" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Sujet" ADD COLUMN     "dateValidation" TIMESTAMP(3),
ADD COLUMN     "motsCles" TEXT[];

-- DropTable
DROP TABLE "_JuryToUser";

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

-- CreateIndex
CREATE UNIQUE INDEX "Jury_memoireId_key" ON "Jury"("memoireId");

-- CreateIndex
CREATE UNIQUE INDEX "Memoire_etudiantId_key" ON "Memoire"("etudiantId");

-- AddForeignKey
ALTER TABLE "Memoire" ADD CONSTRAINT "Memoire_encadreurId_fkey" FOREIGN KEY ("encadreurId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_memoireId_fkey" FOREIGN KEY ("memoireId") REFERENCES "Memoire"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Jury" ADD CONSTRAINT "Jury_memoireId_fkey" FOREIGN KEY ("memoireId") REFERENCES "Memoire"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Jury" ADD CONSTRAINT "Jury_presidentId_fkey" FOREIGN KEY ("presidentId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Jury" ADD CONSTRAINT "Jury_rapporteurId_fkey" FOREIGN KEY ("rapporteurId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Jury" ADD CONSTRAINT "Jury_examinateurId_fkey" FOREIGN KEY ("examinateurId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
