-- CreateTable
CREATE TABLE "Customer" (
    "customerId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "vatId" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Customer_pkey" PRIMARY KEY ("customerId")
);
