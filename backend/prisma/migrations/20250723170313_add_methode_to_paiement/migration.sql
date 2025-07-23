-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('ESPECE', 'ORANGE_MONEY', 'WAVE', 'YAS');

-- AlterTable
ALTER TABLE "Paiement" ADD COLUMN     "methode" "PaymentMethod" NOT NULL DEFAULT 'ESPECE';
