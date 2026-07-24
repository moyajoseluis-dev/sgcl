-- CreateEnum
CREATE TYPE "ExpenseStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- AlterTable
ALTER TABLE "Contract" ADD COLUMN     "costCenterId" INTEGER;

-- CreateTable
CREATE TABLE "CostCenter" (
    "id" SERIAL NOT NULL,
    "laudusId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "budget" DOUBLE PRECISION NOT NULL DEFAULT 0,

    CONSTRAINT "CostCenter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PettyCash" (
    "id" SERIAL NOT NULL,
    "contractId" INTEGER NOT NULL,
    "assignedAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "currentBalance" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "responsibleId" INTEGER NOT NULL,

    CONSTRAINT "PettyCash_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PettyCashExpense" (
    "id" SERIAL NOT NULL,
    "pettyCashId" INTEGER NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "concept" TEXT NOT NULL,
    "receiptUrl" TEXT,
    "status" "ExpenseStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PettyCashExpense_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Workflow" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "entityName" TEXT NOT NULL,
    "states" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Workflow_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CostCenter_laudusId_key" ON "CostCenter"("laudusId");

-- CreateIndex
CREATE UNIQUE INDEX "PettyCash_contractId_key" ON "PettyCash"("contractId");

-- AddForeignKey
ALTER TABLE "Contract" ADD CONSTRAINT "Contract_costCenterId_fkey" FOREIGN KEY ("costCenterId") REFERENCES "CostCenter"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PettyCash" ADD CONSTRAINT "PettyCash_contractId_fkey" FOREIGN KEY ("contractId") REFERENCES "Contract"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PettyCash" ADD CONSTRAINT "PettyCash_responsibleId_fkey" FOREIGN KEY ("responsibleId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PettyCashExpense" ADD CONSTRAINT "PettyCashExpense_pettyCashId_fkey" FOREIGN KEY ("pettyCashId") REFERENCES "PettyCash"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
