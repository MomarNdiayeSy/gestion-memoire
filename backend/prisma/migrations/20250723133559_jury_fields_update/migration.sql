/*
  Warnings:

  - You are about to drop the column `examinateurId` on the `Jury` table. All the data in the column will be lost.
  - You are about to drop the column `presidentId` on the `Jury` table. All the data in the column will be lost.
  - You are about to drop the column `rapporteurId` on the `Jury` table. All the data in the column will be lost.
  - Added the required column `encadreurJury1Id` to the `Jury` table without a default value. This is not possible if the table is not empty.
  - Added the required column `encadreurJury2Id` to the `Jury` table without a default value. This is not possible if the table is not empty.
  - Added the required column `encadreurJury3Id` to the `Jury` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Jury" DROP CONSTRAINT "Jury_examinateurId_fkey";

-- DropForeignKey
ALTER TABLE "Jury" DROP CONSTRAINT "Jury_presidentId_fkey";

-- DropForeignKey
ALTER TABLE "Jury" DROP CONSTRAINT "Jury_rapporteurId_fkey";

-- AlterTable
ALTER TABLE "Jury" DROP COLUMN "examinateurId",
DROP COLUMN "presidentId",
DROP COLUMN "rapporteurId",
ADD COLUMN     "encadreurJury1Id" TEXT NOT NULL,
ADD COLUMN     "encadreurJury2Id" TEXT NOT NULL,
ADD COLUMN     "encadreurJury3Id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Jury" ADD CONSTRAINT "Jury_encadreurJury1Id_fkey" FOREIGN KEY ("encadreurJury1Id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Jury" ADD CONSTRAINT "Jury_encadreurJury2Id_fkey" FOREIGN KEY ("encadreurJury2Id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Jury" ADD CONSTRAINT "Jury_encadreurJury3Id_fkey" FOREIGN KEY ("encadreurJury3Id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
