/*
  Warnings:

  - A unique constraint covering the columns `[encadreurId,numero]` on the table `Session` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Session" ADD COLUMN     "numero" INTEGER NOT NULL DEFAULT 1;

-- CreateIndex
CREATE UNIQUE INDEX "Session_encadreurId_numero_key" ON "Session"("encadreurId", "numero");
