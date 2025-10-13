// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

error DM_NotOwner();
error DM_ZeroAddress();

contract DelegationManager {
  address public owner;

  // owner => delegate => expiresAt (unix seconds)
  mapping(address => mapping(address => uint256)) public allowanceUntil;

  event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);
  event DelegationSet(address indexed vaultOwner, address indexed delegate, uint256 expiresAt);
  event DelegationRevoked(address indexed vaultOwner, address indexed delegate);

  modifier onlyOwner() {
    if (msg.sender != owner) revert DM_NotOwner();
    _;
  }

  constructor() {
    owner = msg.sender;
    emit OwnershipTransferred(address(0), msg.sender);
  }

  function transferOwnership(address newOwner) external onlyOwner {
    if (newOwner == address(0)) revert DM_ZeroAddress();
    emit OwnershipTransferred(owner, newOwner);
    owner = newOwner;
  }

  function setDelegation(address vaultOwner, address delegate, uint256 expiresAt) external {
    // In a full system, require signatures from vaultOwner. For MVP, caller must be vaultOwner.
    if (vaultOwner == address(0) || delegate == address(0)) revert DM_ZeroAddress();
    require(msg.sender == vaultOwner, "ONLY_VAULT_OWNER");
    allowanceUntil[vaultOwner][delegate] = expiresAt;
    emit DelegationSet(vaultOwner, delegate, expiresAt);
  }

  function revokeDelegation(address vaultOwner, address delegate) external {
    if (vaultOwner == address(0) || delegate == address(0)) revert DM_ZeroAddress();
    require(msg.sender == vaultOwner, "ONLY_VAULT_OWNER");
    delete allowanceUntil[vaultOwner][delegate];
    emit DelegationRevoked(vaultOwner, delegate);
  }

  function isDelegateActive(address vaultOwner, address delegate) external view returns (bool) {
    uint256 exp = allowanceUntil[vaultOwner][delegate];
    return exp != 0 && block.timestamp <= exp;
  }
}
