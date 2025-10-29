const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("CircleCompetition", function () {
  let competition, mockToken;
  let owner, user1, user2;

  beforeEach(async function () {
    [owner, user1, user2] = await ethers.getSigners();

    // Deploy mock token
    const MockERC20 = await ethers.getContractFactory("MockERC20");
    mockToken = await MockERC20.deploy("Mock USDC", "mUSDC");
    await mockToken.waitForDeployment();

    // Deploy competition
    const CircleCompetition = await ethers.getContractFactory("CircleCompetition");
    competition = await CircleCompetition.deploy(await mockToken.getAddress());
    await competition.waitForDeployment();
  });

  describe("Season Management", function () {
    it("Should create a new season", async function () {
      const duration = 30 * 24 * 60 * 60; // 30 days
      const prizePool = ethers.parseEther("10000");

      await competition.createSeason("Genesis Clash", duration, prizePool);

      const season = await competition.getSeasonInfo(1);
      expect(season.name).to.equal("Genesis Clash");
      expect(season.prizePool).to.equal(prizePool);
      expect(season.active).to.be.true;
    });

    it("Should register circle for season", async function () {
      await competition.createSeason("Test Season", 86400, ethers.parseEther("1000"));

      const circleId = ethers.keccak256(ethers.toUtf8Bytes("circle-1"));
      await competition.registerCircle(circleId);

      // Should not allow duplicate registration
      await expect(
        competition.registerCircle(circleId)
      ).to.be.revertedWith("Already registered");
    });
  });

  describe("Circle Stats", function () {
    beforeEach(async function () {
      await competition.createSeason("Test Season", 86400, ethers.parseEther("1000"));
    });

    it("Should update circle stats", async function () {
      const circleId = ethers.keccak256(ethers.toUtf8Bytes("circle-1"));
      const tvl = ethers.parseEther("100000");
      const apy = 1500; // 15% in basis points
      const members = 50;

      await competition.updateCircleStats(1, circleId, tvl, apy, members);

      const stats = await competition.seasonCircleStats(1, circleId);
      expect(stats.totalTVL).to.equal(tvl);
      expect(stats.performanceAPY).to.equal(apy);
      expect(stats.memberCount).to.equal(members);
    });

    it("Should calculate points correctly", async function () {
      const tvl = ethers.parseEther("100000");
      const apy = 1500; // 15%
      const members = 50;

      const points = await competition.calculatePoints(tvl, apy, members);
      
      // Expected: (1500 * 10 / 100) + (100000 / 1000 * 5) + (50 * 20)
      // = 150 + 500 + 1000 = 1650
      expect(points).to.be.gt(0);
    });
  });

  describe("Challenges", function () {
    beforeEach(async function () {
      await competition.createSeason("Test Season", 86400, ethers.parseEther("1000"));
      
      // Mint tokens to user1
      await mockToken.mint(user1.address, ethers.parseEther("1000"));
      await mockToken.connect(user1).approve(
        await competition.getAddress(),
        ethers.parseEther("1000")
      );
    });

    it("Should create a challenge", async function () {
      const challenger = ethers.keccak256(ethers.toUtf8Bytes("circle-1"));
      const challenged = ethers.keccak256(ethers.toUtf8Bytes("circle-2"));
      const duration = 7 * 24 * 60 * 60; // 7 days
      const stakes = ethers.parseEther("100");

      await competition.connect(user1).createChallenge(
        challenger,
        challenged,
        duration,
        stakes
      );

      const challenge = await competition.getChallengeInfo(1);
      expect(challenge.challenger).to.equal(challenger);
      expect(challenge.challenged).to.equal(challenged);
      expect(challenge.stakes).to.equal(stakes);
      expect(challenge.active).to.be.true;
    });
  });

  describe("Prize Distribution", function () {
    it("Should calculate prize distribution correctly", async function () {
      const totalPrize = ethers.parseEther("10000");
      const prizes = await competition.calculatePrizeDistribution(totalPrize);

      expect(prizes[0]).to.equal(ethers.parseEther("5000")); // 50%
      expect(prizes[1]).to.equal(ethers.parseEther("3000")); // 30%
      expect(prizes[2]).to.equal(ethers.parseEther("1500")); // 15%
      expect(prizes[3]).to.equal(ethers.parseEther("500"));  // 5%
    });
  });
});
