const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

async function compileCircuit() {
  console.log('🔧 Compiling Circom circuits...\n');

  const circuitPath = path.join(__dirname, '../circuits/delegation_proof.circom');
  const buildDir = path.join(__dirname, '../build');

  // Create build directory
  if (!fs.existsSync(buildDir)) {
    fs.mkdirSync(buildDir, { recursive: true });
  }

  // Compile circuit
  const compileCmd = `circom ${circuitPath} --r1cs --wasm --sym --c -o ${buildDir}`;

  return new Promise((resolve, reject) => {
    exec(compileCmd, (error, stdout, stderr) => {
      if (error) {
        console.error('❌ Compilation failed:', error);
        reject(error);
        return;
      }

      console.log(stdout);
      if (stderr) console.error(stderr);

      console.log('✅ Circuit compiled successfully!');
      console.log(`📁 Output: ${buildDir}`);
      resolve();
    });
  });
}

compileCircuit()
  .then(() => {
    console.log('\n🎉 Compilation complete!');
    console.log('\nNext steps:');
    console.log('1. Run: npm run setup (generate proving/verification keys)');
    console.log('2. Run: npm run generate-proof (create a proof)');
    console.log('3. Run: npm run verify-proof (verify the proof)');
  })
  .catch((err) => {
    console.error('Failed:', err);
    process.exit(1);
  });
