/*
  Warnings:

  - You are about to drop the column `kecamatan` on the `Lead` table. All the data in the column will be lost.
  - You are about to drop the column `kota` on the `Lead` table. All the data in the column will be lost.
  - You are about to drop the column `whatsapp` on the `Lead` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Lead" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "sektor" TEXT NOT NULL,
    "sektorCategory" TEXT NOT NULL,
    "omzetBracket" TEXT NOT NULL,
    "yearsOperating" TEXT NOT NULL,
    "relationMandiri" TEXT NOT NULL,
    "productNeed" TEXT NOT NULL,
    "tenor" TEXT,
    "legal_akta" BOOLEAN NOT NULL,
    "aktaLastChangeYear" INTEGER,
    "legal_nib" BOOLEAN NOT NULL,
    "legal_npwp" BOOLEAN NOT NULL,
    "keyPersonClear" BOOLEAN NOT NULL,
    "creditSelfDeclareOk" TEXT NOT NULL,
    "collateralType" TEXT NOT NULL,
    "ownership" TEXT,
    "locationInArea" TEXT,
    "valueChainEvidence" BOOLEAN NOT NULL,
    "purposeNote" TEXT,
    "reasons" TEXT NOT NULL,
    "checklist" TEXT NOT NULL,
    CONSTRAINT "Lead_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Lead" ("aktaLastChangeYear", "checklist", "collateralType", "createdAt", "createdById", "creditSelfDeclareOk", "id", "keyPersonClear", "legal_akta", "legal_nib", "legal_npwp", "locationInArea", "omzetBracket", "ownership", "productNeed", "purposeNote", "reasons", "relationMandiri", "sektor", "sektorCategory", "status", "tenor", "valueChainEvidence", "yearsOperating") SELECT "aktaLastChangeYear", "checklist", "collateralType", "createdAt", "createdById", "creditSelfDeclareOk", "id", "keyPersonClear", "legal_akta", "legal_nib", "legal_npwp", "locationInArea", "omzetBracket", "ownership", "productNeed", "purposeNote", "reasons", "relationMandiri", "sektor", "sektorCategory", "status", "tenor", "valueChainEvidence", "yearsOperating" FROM "Lead";
DROP TABLE "Lead";
ALTER TABLE "new_Lead" RENAME TO "Lead";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
