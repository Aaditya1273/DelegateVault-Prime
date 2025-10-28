const snarkjs = require('snarkjs');
const path = require('path');
const fs = require('fs');

async function verifyProof() {
  console.log('✅ Verifying ZK proof...\n');

  const buildDir = path.join(__dirname, '../build');
  const vkeyPath = path.join(buildDir, 'verification_key.json');
  const proofPath = path.join(buildDir, 'proof.json');
  const publicPath = path.join(buildDir, 'public.json');

  // Load files
  const vKey = JSON.parse(fs.readFileSync(vkeyPath, 'utf8'));
  const proof = JSON.parse(fs.readFileSync(proofPath, 'utf8'));
  const publicSignals = JSON.parse(fs.readFileSync(publicPath, 'utf8'));

  try {
    // Verify proof
    const isValid = await snarkjs.groth16.verify(vKey, publicSignals, proof);

    if (isValid) {
      console.log('✅ Proof is VALID!');
      console.log('\nThe prover has successfully demonstrated:');
      console.log('1. They own the vault (without revealing private key)');
      console.log('2. The delegation has not expired');
      console.log('3. The chain ID is correct');
      console.log('\nThis proof can be verified on-chain! 🎉');
    } else {
      console.log('❌ Proof is INVALID!');
    }

    return isValid;

  } catch (error) {
    console.error('❌ Verification failed:', error);
    process.exit(1);
  }
}

verifyProof();
