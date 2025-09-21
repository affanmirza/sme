-- CreateEnum
CREATE TYPE "public"."Role" AS ENUM ('ADMIN', 'STAFF');

-- CreateTable
CREATE TABLE "public"."User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" "public"."Role" NOT NULL DEFAULT 'STAFF',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Lead" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
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

    CONSTRAINT "Lead_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- AddForeignKey
ALTER TABLE "public"."Lead" ADD CONSTRAINT "Lead_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
