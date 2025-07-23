-- CreateEnum
CREATE TYPE "JuryStatus" AS ENUM ('PLANIFIE', 'TERMINE', 'ANNULE');

-- AlterTable
ALTER TABLE "Jury" ADD COLUMN     "statut" "JuryStatus" NOT NULL DEFAULT 'PLANIFIE';
