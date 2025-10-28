pragma circom 2.1.6;

include "circomlib/circuits/poseidon.circom";
include "circomlib/circuits/comparators.circom";
include "circomlib/circuits/bitify.circom";

/**
 * DelegationProof Circuit
 * Proves vault ownership and delegation validity without revealing private key
 * ERC-7710 compatible
 */
template DelegationProof() {
    // Private inputs (secret)
    signal input privateKey;
    signal input nonce;
    
    // Public inputs
    signal input vaultAddress;
    signal input delegateAddress;
    signal input expirationTimestamp;
    signal input currentTimestamp;
    signal input chainId;
    
    // Output
    signal output validProof;
    
    // 1. Verify ownership: hash(privateKey, nonce) == vaultAddress
    component ownershipHash = Poseidon(2);
    ownershipHash.inputs[0] <== privateKey;
    ownershipHash.inputs[1] <== nonce;
    
    signal addressDiff;
    addressDiff <== ownershipHash.out - vaultAddress;
    addressDiff === 0;
    
    // 2. Verify delegation hasn't expired
    component timeCheck = LessThan(64);
    timeCheck.in[0] <== currentTimestamp;
    timeCheck.in[1] <== expirationTimestamp;
    
    // 3. Verify chain ID is correct
    component chainCheck = IsEqual();
    chainCheck.in[0] <== chainId;
    chainCheck.in[1] <== 10143; // Monad testnet
    
    // 4. Combine all checks
    signal timeValid;
    signal chainValid;
    signal allValid;
    
    timeValid <== timeCheck.out;
    chainValid <== chainCheck.out;
    allValid <== timeValid * chainValid;
    
    // Output 1 if all checks pass, 0 otherwise
    validProof <== allValid;
}

component main {public [vaultAddress, delegateAddress, expirationTimestamp, currentTimestamp, chainId]} = DelegationProof();
