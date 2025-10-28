const snarkjs = require('snarkjs');
const path = require('path');
const fs = require('fs');

async function exportVerifier() {
  console.log('📤 Exporting Solidity verifier contract...\n');

  const buildDir = path.join(__dirname, '../build');
  const zkeyPath = path.join(buildDir, 'delegation_proof.zkey');
  const verifierPath = path.join(__dirname, '../../contracts/src/DelegationVerifier.sol');

  try {
    // Export verifier contract
    const verifierCode = await snarkjs.zKey.exportSolidityVerifier(zkeyPath);

    // Save to contracts directory
    fs.writeFileSync(verifierPath, verifierCode);

    console.log('✅ Verifier contract exported!');
    console.log(`📁 Location: ${verifierPath}`);
    console.log('\nYou can now deploy this contract to verify proofs on-chain! 🚀');

  } catch (error) {
    console.error('❌ Export failed:', error);
    process.exit(1);
  }
}

exportVerifier();
