// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface IDelegateVault {
  function owner() external view returns (address);
}

error VF_NotOwner();
error VF_ZeroAddress();

contract VaultFactory {
  address public owner;
  address[] public allVaults;

  event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);
  event VaultDeployed(address indexed vault, address indexed creator, address indexed underlying);

  modifier onlyOwner() {
    if (msg.sender != owner) revert VF_NotOwner();
    _;
  }

  constructor() {
    owner = msg.sender;
    emit OwnershipTransferred(address(0), msg.sender);
  }

  function transferOwnership(address newOwner) external onlyOwner {
    if (newOwner == address(0)) revert VF_ZeroAddress();
    emit OwnershipTransferred(owner, newOwner);
    owner = newOwner;
  }

  function deployVault(address underlying) external returns (address vault) {
    // For MVP use direct deployment (not minimal proxies).
    vault = address(new DelegateVault(underlying));
    allVaults.push(vault);
    emit VaultDeployed(vault, msg.sender, underlying);
  }

  function allVaultsLength() external view returns (uint256) {
    return allVaults.length;
  }
}

// Minimal inline DelegateVault to satisfy compiler reference without importing.
// In your toolchain, import contracts/DelegateVault.sol instead.
contract DelegateVault {
  address public immutable underlying;
  address public owner;

  constructor(address underlying_) {
    owner = msg.sender;
    underlying = underlying_;
  }
}
