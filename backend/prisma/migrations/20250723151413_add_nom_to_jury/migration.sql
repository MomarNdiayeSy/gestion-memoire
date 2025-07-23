/*
  Warnings:

  - Added the required column `nom` to the `Jury` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Jury" ADD COLUMN     "nom" TEXT NOT NULL;
