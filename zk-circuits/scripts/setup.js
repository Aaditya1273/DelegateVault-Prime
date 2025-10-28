const snarkjs = require('snarkjs');
const path = require('path');
const fs = require('fs');

async function setupKeys() {
  console.log('🔑 Setting up proving and verification keys...\n');

  const buildDir = path.join(__dirname, '../build');
  const r1csPath = path.join(buildDir, 'delegation_proof.r1cs');
  const ptauPath = path.join(buildDir, 'powersOfTau28_hez_final_12.ptau');
  const zkeyPath = path.join(buildDir, 'delegation_proof.zkey');
  const vkeyPath = path.join(buildDir, 'verification_key.json');

  // Check if r1cs exists
  if (!fs.existsSync(r1csPath)) {
    console.error('❌ R1CS file not found. Run npm run compile first.');
    process.exit(1);
  }

  try {
    // Download Powers of Tau if not exists
    if (!fs.existsSync(ptauPath)) {
      console.log('📥 Downloading Powers of Tau ceremony file...');
      console.log('⚠️  For production, use a larger ceremony file');
      
      // For demo, we'll create a small one
      console.log('Creating Powers of Tau (this may take a minute)...');
      await snarkjs.powersOfTau.newAccumulator(
        { type: 'mem' },
        12,
        ptauPath
      );
      console.log('✅ Powers of Tau created');
    }

    // Generate zkey
    console.log('\n🔐 Generating proving key...');
    await snarkjs.zKey.newZKey(r1csPath, ptauPath, zkeyPath);
    console.log('✅ Proving key generated');

    // Export verification key
    console.log('\n🔓 Exporting verification key...');
    const vKey = await snarkjs.zKey.exportVerificationKey(zkeyPath);
    fs.writeFileSync(vkeyPath, JSON.stringify(vKey, null, 2));
    console.log('✅ Verification key exported');

    console.log('\n🎉 Setup complete!');
    console.log(`📁 Proving key: ${zkeyPath}`);
    console.log(`📁 Verification key: ${vkeyPath}`);

  } catch (error) {
    console.error('❌ Setup failed:', error);
    process.exit(1);
  }
}

setupKeys();
