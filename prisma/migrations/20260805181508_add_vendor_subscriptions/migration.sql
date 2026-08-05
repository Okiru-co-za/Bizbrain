-- CreateEnum
CREATE TYPE "BillingCycle" AS ENUM ('WEEKLY', 'MONTHLY', 'ANNUAL', 'ONCE_OFF');

-- CreateEnum
CREATE TYPE "VendorSubscriptionStatus" AS ENUM ('ACTIVE', 'TRIAL', 'CANCELLED');

-- CreateTable
CREATE TABLE "VendorSubscription" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT,
    "costCents" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'ZAR',
    "billingCycle" "BillingCycle" NOT NULL DEFAULT 'MONTHLY',
    "status" "VendorSubscriptionStatus" NOT NULL DEFAULT 'ACTIVE',
    "nextRenewalAt" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VendorSubscription_pkey" PRIMARY KEY ("id")
);

