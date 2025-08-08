-- CreateEnum
CREATE TYPE "StudentLevel" AS ENUM ('LICENCE', 'MASTER');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "academicYear" TEXT,
ADD COLUMN     "level" "StudentLevel";
