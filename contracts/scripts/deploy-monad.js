const hre = require("hardhat");

async function main() {
  console.log("🚀 Deploying DelegateVault Prime to Monad Testnet...\n");

  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying with account:", deployer.address);
  console.log("Account balance:", (await hre.ethers.provider.getBalance(deployer.address)).toString());
  console.log("Network:", hre.network.name);
  console.log("");

  // 1. Deploy Mock ERC20 (test token)
  console.log("📝 Deploying MockERC20 (Test USDC)...");
  const MockERC20 = await hre.ethers.getContractFactory("MockERC20");
  const mockToken = await MockERC20.deploy("Mock USDC", "mUSDC");
  await mockToken.waitForDeployment();
  const mockTokenAddress = await mockToken.getAddress();
  console.log("✅ MockERC20 deployed to:", mockTokenAddress);
  console.log("");

  // 2. Deploy VaultFactory
  console.log("📝 Deploying VaultFactory...");
  const VaultFactory = await hre.ethers.getContractFactory("VaultFactory");
  const factory = await VaultFactory.deploy();
  await factory.waitForDeployment();
  const factoryAddress = await factory.getAddress();
  console.log("✅ VaultFactory deployed to:", factoryAddress);
  console.log("");

  // 3. Deploy AchievementNFT
  console.log("📝 Deploying AchievementNFT...");
  const AchievementNFT = await hre.ethers.getContractFactory("AchievementNFT");
  const achievementNFT = await AchievementNFT.deploy();
  await achievementNFT.waitForDeployment();
  const achievementNFTAddress = await achievementNFT.getAddress();
  console.log("✅ AchievementNFT deployed to:", achievementNFTAddress);
  console.log("");

  // 4. Deploy GovernanceToken
  console.log("📝 Deploying GovernanceToken (DVP)...");
  const GovernanceToken = await hre.ethers.getContractFactory("GovernanceToken");
  const govToken = await GovernanceToken.deploy();
  await govToken.waitForDeployment();
  const govTokenAddress = await govToken.getAddress();
  console.log("✅ GovernanceToken deployed to:", govTokenAddress);
  console.log("");

  // 5. Deploy CircleCompetition
  console.log("📝 Deploying CircleCompetition...");
  const CircleCompetition = await hre.ethers.getContractFactory("CircleCompetition");
  const circleCompetition = await CircleCompetition.deploy(mockTokenAddress);
  await circleCompetition.waitForDeployment();
  const circleCompetitionAddress = await circleCompetition.getAddress();
  console.log("✅ CircleCompetition deployed to:", circleCompetitionAddress);
  console.log("");

  // 6. Deploy ERC4337Paymaster
  console.log("📝 Deploying ERC4337Paymaster...");
  const ERC4337Paymaster = await hre.ethers.getContractFactory("ERC4337Paymaster");
  const paymaster = await ERC4337Paymaster.deploy();
  await paymaster.waitForDeployment();
  const paymasterAddress = await paymaster.getAddress();
  console.log("✅ ERC4337Paymaster deployed to:", paymasterAddress);
  console.log("");

  // 7. Deploy MultiSigOverride
  console.log("📝 Deploying MultiSigOverride...");
  const MultiSigOverride = await hre.ethers.getContractFactory("MultiSigOverride");
  const multiSig = await MultiSigOverride.deploy();
  await multiSig.waitForDeployment();
  const multiSigAddress = await multiSig.getAddress();
  console.log("✅ MultiSigOverride deployed to:", multiSigAddress);
  console.log("");

  // 8. Create a test vault
  console.log("📝 Creating test vault...");
  const createTx = await factory.createVault(
    mockTokenAddress,
    "Monad Test Vault",
    "MTV",
    200 // 2% performance fee
  );
  await createTx.wait();
  const vaults = await factory.getAllVaults();
  const testVaultAddress = vaults[0];
  console.log("✅ Test Vault created at:", testVaultAddress);
  console.log("");

  // 9. Setup achievements
  console.log("📝 Setting up achievements...");
  
  const achievements = [
    { id: 1, name: "First Steps", desc: "Created first vault", rarity: 0, points: 100 },
    { id: 2, name: "Delegation Master", desc: "Created 10 delegations", rarity: 1, points: 500 },
    { id: 3, name: "Whale Status", desc: "TVL > $100k", rarity: 2, points: 1000 },
    { id: 4, name: "Week Warrior", desc: "7 day streak", rarity: 0, points: 200 },
    { id: 5, name: "Monthly Master", desc: "30 day streak", rarity: 2, points: 1000 },
  ];

  for (const achievement of achievements) {
    const tx = await achievementNFT.createAchievement(
      achievement.id,
      achievement.name,
      achievement.desc,
      achievement.rarity,
      achievement.points
    );
    await tx.wait();
    console.log(`✅ Created achievement: ${achievement.name}`);
  }
  console.log("");

  // 10. Setup paymaster with test token
  console.log("📝 Setting up paymaster...");
  const addTokenTx = await paymaster.addSupportedToken(
    mockTokenAddress,
    hre.ethers.parseUnits("0.001", "ether") // 0.001 ETH per token
  );
  await addTokenTx.wait();
  console.log("✅ Added mock token to paymaster");
  console.log("");

  // 11. Create first competition season
  console.log("📝 Creating competition season...");
  const seasonTx = await circleCompetition.createSeason(
    "Genesis Clash",
    30 * 24 * 60 * 60, // 30 days
    hre.ethers.parseEther("10000") // 10k prize pool
  );
  await seasonTx.wait();
  console.log("✅ Created season: Genesis Clash");
  console.log("");

  // Summary
  console.log("🎉 Deployment Complete!\n");
  console.log("📋 Contract Addresses on Monad Testnet:");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("MockERC20:           ", mockTokenAddress);
  console.log("VaultFactory:        ", factoryAddress);
  console.log("AchievementNFT:      ", achievementNFTAddress);
  console.log("GovernanceToken:     ", govTokenAddress);
  console.log("CircleCompetition:   ", circleCompetitionAddress);
  console.log("ERC4337Paymaster:    ", paymasterAddress);
  console.log("MultiSigOverride:    ", multiSigAddress);
  console.log("Test Vault:          ", testVaultAddress);
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

  // Save addresses
  const addresses = {
    network: "monad-testnet",
    chainId: 10143,
    deployer: deployer.address,
    contracts: {
      mockToken: mockTokenAddress,
      factory: factoryAddress,
      achievementNFT: achievementNFTAddress,
      governanceToken: govTokenAddress,
      circleCompetition: circleCompetitionAddress,
      paymaster: paymasterAddress,
      multiSig: multiSigAddress,
      testVault: testVaultAddress,
    },
    deployedAt: new Date().toISOString(),
  };

  const fs = require("fs");
  fs.writeFileSync(
    "deployed-monad.json",
    JSON.stringify(addresses, null, 2)
  );
  console.log("💾 Addresses saved to deployed-monad.json\n");

  // Verification commands
  console.log("🔍 Verify contracts with:");
  console.log(`npx hardhat verify --network monad ${mockTokenAddress} "Mock USDC" "mUSDC"`);
  console.log(`npx hardhat verify --network monad ${factoryAddress}`);
  console.log(`npx hardhat verify --network monad ${achievementNFTAddress}`);
  console.log(`npx hardhat verify --network monad ${govTokenAddress}`);
  console.log(`npx hardhat verify --network monad ${circleCompetitionAddress} ${mockTokenAddress}`);
  console.log(`npx hardhat verify --network monad ${paymasterAddress}`);
  console.log(`npx hardhat verify --network monad ${multiSigAddress}`);
  console.log("");

  // Next steps
  console.log("🚀 Next Steps:");
  console.log("1. Verify contracts on Monad explorer");
  console.log("2. Update frontend with contract addresses");
  console.log("3. Test vault deposits and delegations");
  console.log("4. Create competition season");
  console.log("5. Test gasless transactions with paymaster\n");

  console.log("🎉 Monad deployment successful! Ready for production! 🚀\n");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
