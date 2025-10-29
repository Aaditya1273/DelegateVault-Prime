// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./DelegateVault.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title VaultFactory
 * @notice Factory for creating DelegateVault instances
 */
contract VaultFactory is Ownable {
    // Registry
    address[] public allVaults;
    mapping(address => address[]) public userVaults;
    mapping(address => bool) public isVault;

    // Fee configuration
    uint256 public creationFee;
    uint256 public defaultPerformanceFee = 200; // 2%

    event VaultCreated(
        address indexed vault,
        address indexed owner,
        address indexed asset,
        string name
    );
    event CreationFeeUpdated(uint256 oldFee, uint256 newFee);

    constructor() Ownable(msg.sender) {}

    /**
     * @notice Create new vault
     */
    function createVault(
        address asset,
        string memory name,
        string memory symbol,
        uint256 performanceFee
    ) external payable returns (address) {
        require(msg.value >= creationFee, "Insufficient creation fee");
        require(asset != address(0), "Invalid asset");
        require(performanceFee <= 2000, "Fee too high"); // Max 20%

        // Deploy new vault
        DelegateVault vault = new DelegateVault(
            asset,
            name,
            symbol,
            performanceFee > 0 ? performanceFee : defaultPerformanceFee
        );

        // Transfer ownership to creator
        vault.transferOwnership(msg.sender);

        // Register vault
        address vaultAddress = address(vault);
        allVaults.push(vaultAddress);
        userVaults[msg.sender].push(vaultAddress);
        isVault[vaultAddress] = true;

        emit VaultCreated(vaultAddress, msg.sender, asset, name);

        return vaultAddress;
    }

    /**
     * @notice Get all vaults
     */
    function getAllVaults() external view returns (address[] memory) {
        return allVaults;
    }

    /**
     * @notice Get user's vaults
     */
    function getUserVaults(address user) external view returns (address[] memory) {
        return userVaults[user];
    }

    /**
     * @notice Get total vault count
     */
    function getVaultCount() external view returns (uint256) {
        return allVaults.length;
    }

    /**
     * @notice Set creation fee
     */
    function setCreationFee(uint256 newFee) external onlyOwner {
        uint256 oldFee = creationFee;
        creationFee = newFee;
        emit CreationFeeUpdated(oldFee, newFee);
    }

    /**
     * @notice Set default performance fee
     */
    function setDefaultPerformanceFee(uint256 newFee) external onlyOwner {
        require(newFee <= 2000, "Fee too high");
        defaultPerformanceFee = newFee;
    }

    /**
     * @notice Withdraw collected fees
     */
    function withdrawFees() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No fees to withdraw");
        payable(owner()).transfer(balance);
    }

    receive() external payable {}
}
