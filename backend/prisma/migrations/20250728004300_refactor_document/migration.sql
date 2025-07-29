/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Document` table. All the data in the column will be lost.
  - You are about to drop the column `nom` on the `Document` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Document` table. All the data in the column will be lost.
  - You are about to drop the column `url` on the `Document` table. All the data in the column will be lost.
  - You are about to drop the column `version` on the `Document` table. All the data in the column will be lost.
  - Added the required column `fichierUrl` to the `Document` table without a default value. This is not possible if the table is not empty.
  - Added the required column `numero` to the `Document` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Document" DROP COLUMN "createdAt",
DROP COLUMN "nom",
DROP COLUMN "type",
DROP COLUMN "url",
DROP COLUMN "version",
ADD COLUMN     "commentaire" TEXT,
ADD COLUMN     "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "fichierUrl" TEXT NOT NULL,
ADD COLUMN     "numero" TEXT NOT NULL;
