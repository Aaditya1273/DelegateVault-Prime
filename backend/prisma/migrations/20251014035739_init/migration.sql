-- CreateTable
CREATE TABLE "Vault" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "address" TEXT NOT NULL,
    "chainId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "assetSymbol" TEXT NOT NULL,
    "underlying" TEXT,
    "owner" TEXT NOT NULL,
    "tvl" TEXT,
    "totalShares" TEXT,
    "totalAssets" TEXT,
    "feeBps" INTEGER,
    "paused" BOOLEAN NOT NULL DEFAULT false,
    "performanceAPY" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Position" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "vaultId" TEXT NOT NULL,
    "userAddress" TEXT NOT NULL,
    "shares" TEXT NOT NULL,
    "assets" TEXT NOT NULL,
    "entryPrice" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Position_vaultId_fkey" FOREIGN KEY ("vaultId") REFERENCES "Vault" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Delegation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "vaultId" TEXT NOT NULL,
    "vaultOwner" TEXT NOT NULL,
    "delegate" TEXT NOT NULL,
    "expiresAt" DATETIME NOT NULL,
    "zkProof" TEXT,
    "signature" TEXT,
    "nonce" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Delegation_vaultId_fkey" FOREIGN KEY ("vaultId") REFERENCES "Vault" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "VaultEvent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "vaultId" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "blockNumber" TEXT NOT NULL,
    "transactionHash" TEXT NOT NULL,
    "logIndex" INTEGER NOT NULL,
    "data" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "VaultEvent_vaultId_fkey" FOREIGN KEY ("vaultId") REFERENCES "Vault" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "address" TEXT NOT NULL,
    "username" TEXT,
    "email" TEXT,
    "farcasterFid" TEXT,
    "nftBadges" TEXT,
    "streakDays" INTEGER NOT NULL DEFAULT 0,
    "totalPoints" INTEGER NOT NULL DEFAULT 0,
    "tier" TEXT NOT NULL DEFAULT 'free',
    "referralCode" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Circle" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "vaultId" TEXT NOT NULL,
    "competitionMode" BOOLEAN NOT NULL DEFAULT false,
    "totalMembers" INTEGER NOT NULL DEFAULT 0,
    "ranking" INTEGER,
    "performanceAPY" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Circle_vaultId_fkey" FOREIGN KEY ("vaultId") REFERENCES "Vault" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CircleMember" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "circleId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "vaultId" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'member',
    "joinedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "CircleMember_circleId_fkey" FOREIGN KEY ("circleId") REFERENCES "Circle" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "CircleMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "CircleMember_vaultId_fkey" FOREIGN KEY ("vaultId") REFERENCES "Vault" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AIStrategy" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "vaultId" TEXT NOT NULL,
    "strategyType" TEXT NOT NULL,
    "parameters" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "performance" TEXT,
    "reasoningTrail" TEXT,
    "lastExecuted" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "AIStrategy_vaultId_fkey" FOREIGN KEY ("vaultId") REFERENCES "Vault" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AIPreference" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "riskTolerance" TEXT NOT NULL DEFAULT 'medium',
    "autoRebalance" BOOLEAN NOT NULL DEFAULT true,
    "maxSlippage" TEXT NOT NULL DEFAULT '0.5',
    "preferences" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "AIPreference_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Referral" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "referrerId" TEXT NOT NULL,
    "referredAddress" TEXT NOT NULL,
    "rewardPoints" INTEGER NOT NULL DEFAULT 100,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Referral_referrerId_fkey" FOREIGN KEY ("referrerId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Vault_address_key" ON "Vault"("address");

-- CreateIndex
CREATE INDEX "Position_userAddress_idx" ON "Position"("userAddress");

-- CreateIndex
CREATE UNIQUE INDEX "Position_vaultId_userAddress_key" ON "Position"("vaultId", "userAddress");

-- CreateIndex
CREATE INDEX "Delegation_vaultOwner_idx" ON "Delegation"("vaultOwner");

-- CreateIndex
CREATE INDEX "Delegation_delegate_idx" ON "Delegation"("delegate");

-- CreateIndex
CREATE INDEX "VaultEvent_vaultId_idx" ON "VaultEvent"("vaultId");

-- CreateIndex
CREATE UNIQUE INDEX "VaultEvent_transactionHash_logIndex_key" ON "VaultEvent"("transactionHash", "logIndex");

-- CreateIndex
CREATE UNIQUE INDEX "User_address_key" ON "User"("address");

-- CreateIndex
CREATE UNIQUE INDEX "User_referralCode_key" ON "User"("referralCode");

-- CreateIndex
CREATE UNIQUE INDEX "Circle_vaultId_key" ON "Circle"("vaultId");

-- CreateIndex
CREATE INDEX "CircleMember_userId_idx" ON "CircleMember"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "CircleMember_circleId_userId_key" ON "CircleMember"("circleId", "userId");

-- CreateIndex
CREATE INDEX "AIStrategy_vaultId_idx" ON "AIStrategy"("vaultId");

-- CreateIndex
CREATE UNIQUE INDEX "AIPreference_userId_key" ON "AIPreference"("userId");

-- CreateIndex
CREATE INDEX "Referral_referrerId_idx" ON "Referral"("referrerId");
