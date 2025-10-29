const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("DelegateVault", function () {
  let vault, mockToken;
  let owner, user1, user2, delegate;

  beforeEach(async function () {
    [owner, user1, user2, delegate] = await ethers.getSigners();

    // Deploy mock token
    const MockERC20 = await ethers.getContractFactory("MockERC20");
    mockToken = await MockERC20.deploy("Mock USDC", "mUSDC");
    await mockToken.waitForDeployment();

    // Deploy vault
    const DelegateVault = await ethers.getContractFactory("DelegateVault");
    vault = await DelegateVault.deploy(
      await mockToken.getAddress(),
      "Test Vault",
      "TV",
      200 // 2% fee
    );
    await vault.waitForDeployment();

    // Mint tokens to users
    await mockToken.mint(user1.address, ethers.parseEther("10000"));
    await mockToken.mint(user2.address, ethers.parseEther("10000"));
  });

  describe("Deposits", function () {
    it("Should allow deposits", async function () {
      const amount = ethers.parseEther("1000");
      
      await mockToken.connect(user1).approve(await vault.getAddress(), amount);
      await vault.connect(user1).deposit(amount);

      const balance = await vault.balanceOf(user1.address);
      expect(balance).to.equal(amount);
    });

    it("Should mint correct shares", async function () {
      const amount = ethers.parseEther("1000");
      
      await mockToken.connect(user1).approve(await vault.getAddress(), amount);
      await vault.connect(user1).deposit(amount);

      const shares = await vault.shares(user1.address);
      expect(shares).to.equal(amount);
    });

    it("Should reject zero deposits", async function () {
      await expect(
        vault.connect(user1).deposit(0)
      ).to.be.revertedWith("Cannot deposit 0");
    });
  });

  describe("Withdrawals", function () {
    beforeEach(async function () {
      const amount = ethers.parseEther("1000");
      await mockToken.connect(user1).approve(await vault.getAddress(), amount);
      await vault.connect(user1).deposit(amount);
    });

    it("Should allow withdrawals", async function () {
      const shares = await vault.shares(user1.address);
      const balanceBefore = await mockToken.balanceOf(user1.address);

      await vault.connect(user1).withdraw(shares);

      const balanceAfter = await mockToken.balanceOf(user1.address);
      expect(balanceAfter).to.be.gt(balanceBefore);
    });

    it("Should reject withdrawals exceeding balance", async function () {
      const shares = await vault.shares(user1.address);
      
      await expect(
        vault.connect(user1).withdraw(shares + 1n)
      ).to.be.revertedWith("Insufficient shares");
    });
  });

  describe("Delegations", function () {
    beforeEach(async function () {
      const amount = ethers.parseEther("1000");
      await mockToken.connect(user1).approve(await vault.getAddress(), amount);
      await vault.connect(user1).deposit(amount);
    });

    it("Should create delegation", async function () {
      const expiresAt = Math.floor(Date.now() / 1000) + 86400; // 1 day
      const zkProof = ethers.keccak256(ethers.toUtf8Bytes("test-proof"));

      await vault.connect(user1).createDelegation(
        delegate.address,
        expiresAt,
        zkProof
      );

      const delegation = await vault.delegations(user1.address);
      expect(delegation.delegate).to.equal(delegate.address);
      expect(delegation.active).to.be.true;
    });

    it("Should validate delegate", async function () {
      const expiresAt = Math.floor(Date.now() / 1000) + 86400;
      const zkProof = ethers.keccak256(ethers.toUtf8Bytes("test-proof"));

      await vault.connect(user1).createDelegation(
        delegate.address,
        expiresAt,
        zkProof
      );

      const isValid = await vault.isValidDelegate(user1.address, delegate.address);
      expect(isValid).to.be.true;
    });

    it("Should revoke delegation", async function () {
      const expiresAt = Math.floor(Date.now() / 1000) + 86400;
      const zkProof = ethers.keccak256(ethers.toUtf8Bytes("test-proof"));

      await vault.connect(user1).createDelegation(
        delegate.address,
        expiresAt,
        zkProof
      );

      await vault.connect(user1).revokeDelegation();

      const delegation = await vault.delegations(user1.address);
      expect(delegation.active).to.be.false;
    });

    it("Should reject expired delegations", async function () {
      const expiresAt = Math.floor(Date.now() / 1000) - 1; // Already expired
      const zkProof = ethers.keccak256(ethers.toUtf8Bytes("test-proof"));

      await expect(
        vault.connect(user1).createDelegation(
          delegate.address,
          expiresAt,
          zkProof
        )
      ).to.be.revertedWith("Invalid expiration");
    });
  });

  describe("Vault Info", function () {
    it("Should return correct vault info", async function () {
      const info = await vault.getVaultInfo();
      
      expect(info.asset_).to.equal(await mockToken.getAddress());
      expect(info.performanceFee_).to.equal(200);
    });
  });

  describe("Admin Functions", function () {
    it("Should allow owner to update fee", async function () {
      await vault.connect(owner).setPerformanceFee(300);
      
      const info = await vault.getVaultInfo();
      expect(info.performanceFee_).to.equal(300);
    });

    it("Should reject fee above max", async function () {
      await expect(
        vault.connect(owner).setPerformanceFee(2001)
      ).to.be.revertedWith("Fee too high");
    });

    it("Should allow owner to pause", async function () {
      await vault.connect(owner).pause();
      
      const amount = ethers.parseEther("100");
      await mockToken.connect(user1).approve(await vault.getAddress(), amount);
      
      await expect(
        vault.connect(user1).deposit(amount)
      ).to.be.revertedWithCustomError(vault, "EnforcedPause");
    });
  });
});
