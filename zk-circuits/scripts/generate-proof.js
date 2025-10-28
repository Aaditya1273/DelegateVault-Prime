const snarkjs = require('snarkjs');
const path = require('path');
const fs = require('fs');

async function generateProof() {
  console.log('🔐 Generating ZK proof...\n');

  const buildDir = path.join(__dirname, '../build');
  const wasmPath = path.join(buildDir, 'delegation_proof_js/delegation_proof.wasm');
  const zkeyPath = path.join(buildDir, 'delegation_proof.zkey');
  const proofPath = path.join(buildDir, 'proof.json');
  const publicPath = path.join(buildDir, 'public.json');

  // Example inputs
  const input = {
    privateKey: '12345678901234567890',  // Private (secret)
    nonce: '98765',  // Private (secret)
    vaultAddress: '123456789012345678901234567890',  // Public
    delegateAddress: '987654321098765432109876543210',  // Public
    expirationTimestamp: Math.floor(Date.now() / 1000) + 86400,  // Public (1 day from now)
    currentTimestamp: Math.floor(Date.now() / 1000),  // Public
    chainId: 10143,  // Public (Monad testnet)
  };

  console.log('Input (public only):');
  console.log('- Vault Address:', input.vaultAddress);
  console.log('- Delegate Address:', input.delegateAddress);
  console.log('- Expiration:', new Date(input.expirationTimestamp * 1000).toISOString());
  console.log('- Chain ID:', input.chainId);
  console.log('');

  try {
    // Generate witness
    console.log('📝 Generating witness...');
    const { proof, publicSignals } = await snarkjs.groth16.fullProve(
      input,
      wasmPath,
      zkeyPath
    );

    // Save proof
    fs.writeFileSync(proofPath, JSON.stringify(proof, null, 2));
    fs.writeFileSync(publicPath, JSON.stringify(publicSignals, null, 2));

    console.log('✅ Proof generated successfully!');
    console.log(`📁 Proof: ${proofPath}`);
    console.log(`📁 Public signals: ${publicPath}`);
    console.log('\nProof:', JSON.stringify(proof, null, 2));

  } catch (error) {
    console.error('❌ Proof generation failed:', error);
    process.exit(1);
  }
}

generateProof();
