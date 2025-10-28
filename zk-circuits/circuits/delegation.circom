pragma circom 2.0.0;

// Simple delegation proof circuit
// Proves you own a vault without revealing the private key

include "../node_modules/circomlib/circuits/poseidon.circom";
include "../node_modules/circomlib/circuits/comparators.circom";

template DelegationProof() {
    // Private inputs
    signal input privateKey;
    signal input nonce;
    
    // Public inputs
    signal input vaultAddress;
    signal input delegateAddress;
    signal input expirationTime;
    signal input currentTime;
    
    // Output
    signal output validProof;
    
    // Hash private key to get public address
    component hasher = Poseidon(2);
    hasher.inputs[0] <== privateKey;
    hasher.inputs[1] <== nonce;
    
    // Verify the hash matches the vault address
    signal addressMatch;
    addressMatch <== hasher.out - vaultAddress;
    addressMatch === 0;
    
    // Verify delegation hasn't expired
    component timeCheck = LessThan(64);
    timeCheck.in[0] <== currentTime;
    timeCheck.in[1] <== expirationTime;
    
    // Output valid if both checks pass
    validProof <== timeCheck.out;
}

component main {public [vaultAddress, delegateAddress, expirationTime, currentTime]} = DelegationProof();
