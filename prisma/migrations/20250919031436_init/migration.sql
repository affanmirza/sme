-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'STAFF',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Lead" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "sektor" TEXT NOT NULL,
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
    "whatsapp" TEXT NOT NULL,
    "kecamatan" TEXT NOT NULL,
    "kota" TEXT NOT NULL,
    "reasons" TEXT NOT NULL,
    "checklist" TEXT NOT NULL,
    CONSTRAINT "Lead_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
