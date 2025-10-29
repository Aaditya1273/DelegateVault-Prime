const hre = require("hardhat");

async function main() {
  console.log("🚀 Deploying DelegateVault Prime Contracts...\n");

  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying with account:", deployer.address);
  console.log("Account balance:", (await hre.ethers.provider.getBalance(deployer.address)).toString());
  console.log("");

  // 1. Deploy Mock ERC20 (for testing)
  console.log("📝 Deploying MockERC20...");
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
  console.log("📝 Deploying GovernanceToken...");
  const GovernanceToken = await hre.ethers.getContractFactory("GovernanceToken");
  const govToken = await GovernanceToken.deploy();
  await govToken.waitForDeployment();
  const govTokenAddress = await govToken.getAddress();
  console.log("✅ GovernanceToken deployed to:", govTokenAddress);
  console.log("");

  // 5. Create a test vault
  console.log("📝 Creating test vault...");
  const createTx = await factory.createVault(
    mockTokenAddress,
    "Test Vault",
    "TV",
    200 // 2% performance fee
  );
  await createTx.wait();
  const vaults = await factory.getAllVaults();
  const testVaultAddress = vaults[0];
  console.log("✅ Test Vault created at:", testVaultAddress);
  console.log("");

  // 6. Setup achievements
  console.log("📝 Setting up achievements...");
  
  const achievements = [
    { id: 1, name: "First Steps", desc: "Created first vault", rarity: 0, points: 100 },
    { id: 2, name: "Delegation Master", desc: "Created 10 delegations", rarity: 1, points: 500 },
    { id: 3, name: "Whale Status", desc: "TVL > $100k", rarity: 2, points: 1000 },
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

  // Summary
  console.log("🎉 Deployment Complete!\n");
  console.log("📋 Contract Addresses:");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("MockERC20:       ", mockTokenAddress);
  console.log("VaultFactory:    ", factoryAddress);
  console.log("AchievementNFT:  ", achievementNFTAddress);
  console.log("GovernanceToken: ", govTokenAddress);
  console.log("Test Vault:      ", testVaultAddress);
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

  // Save addresses
  const addresses = {
    mockToken: mockTokenAddress,
    factory: factoryAddress,
    achievementNFT: achievementNFTAddress,
    governanceToken: govTokenAddress,
    testVault: testVaultAddress,
    network: hre.network.name,
    deployer: deployer.address,
  };

  const fs = require("fs");
  fs.writeFileSync(
    "deployed-addresses.json",
    JSON.stringify(addresses, null, 2)
  );
  console.log("💾 Addresses saved to deployed-addresses.json\n");

  // Next steps
  console.log("🚀 Next Steps:");
  console.log("1. Verify contracts: npx hardhat verify --network <network> <address>");
  console.log("2. Update frontend with contract addresses");
  console.log("3. Test vault deposits and delegations");
  console.log("4. Mint achievement NFTs\n");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
