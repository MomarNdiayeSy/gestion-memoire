/*
  Warnings:

  - You are about to drop the column `lue` on the `Notification` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Notification" DROP COLUMN "lue",
ADD COLUMN     "lu" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Paiement" ALTER COLUMN "status" SET DEFAULT 'EN_ATTENTE';
