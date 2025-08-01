/*
  Migration corrigée : ajout de la valeur 'VALIDE_ADMIN' et conversion sécurisée
*/

-- Ajouter la nouvelle valeur dans l'enum existant
ALTER TYPE "MemoireStatus" ADD VALUE IF NOT EXISTS 'VALIDE_ADMIN';

-- Modifier la colonne status sans perte de données
ALTER TABLE "Memoire"
  ALTER COLUMN "status" DROP DEFAULT,
  ALTER COLUMN "status" TYPE "MemoireStatus"
  USING (
    CASE "status"
      WHEN 'EN_COURS' THEN 'EN_COURS'
      WHEN 'SOUMIS' THEN 'SOUMIS'
      WHEN 'EN_REVISION' THEN 'EN_REVISION'
      WHEN 'VALIDE' THEN 'VALIDE'
      WHEN 'VALIDE_ADMIN' THEN 'VALIDE_ADMIN'
      WHEN 'REJETE' THEN 'REJETE'
      WHEN 'SOUTENU' THEN 'SOUTENU'
      ELSE 'EN_COURS'
    END::"MemoireStatus"
  ),
  ALTER COLUMN "status" SET DEFAULT 'EN_COURS';
