-- CreateTable
CREATE TABLE "SessionRequest" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "heure" TEXT NOT NULL,
    "type" "SessionType" NOT NULL,
    "statut" TEXT NOT NULL DEFAULT 'EN_ATTENTE',
    "etudiantId" TEXT NOT NULL,
    "encadreurId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SessionRequest_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SessionRequest" ADD CONSTRAINT "SessionRequest_etudiantId_fkey" FOREIGN KEY ("etudiantId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SessionRequest" ADD CONSTRAINT "SessionRequest_encadreurId_fkey" FOREIGN KEY ("encadreurId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
