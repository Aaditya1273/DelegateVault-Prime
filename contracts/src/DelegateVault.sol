// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

/**
 * @title DelegateVault
 * @notice ERC-4626 compliant vault with delegation capabilities
 */
contract DelegateVault is Ownable, ReentrancyGuard, Pausable {
    using SafeERC20 for IERC20;

    // Vault state
    IERC20 public immutable asset;
    string public name;
    string public symbol;
    uint256 public totalAssets;
    uint256 public totalShares;
    uint256 public performanceFee; // in basis points (100 = 1%)

    // Delegation state
    struct Delegation {
        address delegate;
        uint256 expiresAt;
        bool active;
        bytes32 zkProof; // ZK proof hash
    }

    mapping(address => Delegation) public delegations;
    mapping(address => uint256) public shares;
    mapping(address => uint256) public lastDepositTime;

    // Events
    event Deposit(address indexed user, uint256 assets, uint256 shares);
    event Withdraw(address indexed user, uint256 assets, uint256 shares);
    event DelegationCreated(address indexed owner, address indexed delegate, uint256 expiresAt);
    event DelegationRevoked(address indexed owner, address indexed delegate);
    event PerformanceFeeUpdated(uint256 oldFee, uint256 newFee);

    constructor(
        address _asset,
        string memory _name,
        string memory _symbol,
        uint256 _performanceFee
    ) Ownable(msg.sender) {
        asset = IERC20(_asset);
        name = _name;
        symbol = _symbol;
        performanceFee = _performanceFee;
    }

    /**
     * @notice Deposit assets into vault
     */
    function deposit(uint256 assets) external nonReentrant whenNotPaused returns (uint256 shares_) {
        require(assets > 0, "Cannot deposit 0");

        shares_ = convertToShares(assets);
        require(shares_ > 0, "Invalid share amount");

        shares[msg.sender] += shares_;
        totalShares += shares_;
        totalAssets += assets;
        lastDepositTime[msg.sender] = block.timestamp;

        asset.safeTransferFrom(msg.sender, address(this), assets);

        emit Deposit(msg.sender, assets, shares_);
    }

    /**
     * @notice Withdraw assets from vault
     */
    function withdraw(uint256 shares_) external nonReentrant returns (uint256 assets_) {
        require(shares_ > 0, "Cannot withdraw 0");
        require(shares[msg.sender] >= shares_, "Insufficient shares");

        assets_ = convertToAssets(shares_);
        require(assets_ > 0, "Invalid asset amount");

        shares[msg.sender] -= shares_;
        totalShares -= shares_;
        totalAssets -= assets_;

        asset.safeTransfer(msg.sender, assets_);

        emit Withdraw(msg.sender, assets_, shares_);
    }

    /**
     * @notice Create delegation with optional ZK proof
     */
    function createDelegation(
        address delegate,
        uint256 expiresAt,
        bytes32 zkProof
    ) external {
        require(delegate != address(0), "Invalid delegate");
        require(expiresAt > block.timestamp, "Invalid expiration");
        require(shares[msg.sender] > 0, "No shares to delegate");

        delegations[msg.sender] = Delegation({
            delegate: delegate,
            expiresAt: expiresAt,
            active: true,
            zkProof: zkProof
        });

        emit DelegationCreated(msg.sender, delegate, expiresAt);
    }

    /**
     * @notice Revoke delegation
     */
    function revokeDelegation() external {
        require(delegations[msg.sender].active, "No active delegation");

        address delegate = delegations[msg.sender].delegate;
        delete delegations[msg.sender];

        emit DelegationRevoked(msg.sender, delegate);
    }

    /**
     * @notice Execute action as delegate
     */
    function executeAsDelegate(
        address owner,
        bytes calldata data
    ) external returns (bytes memory) {
        Delegation memory delegation = delegations[owner];
        
        require(delegation.active, "No active delegation");
        require(delegation.delegate == msg.sender, "Not authorized delegate");
        require(delegation.expiresAt > block.timestamp, "Delegation expired");

        // Execute delegated action
        (bool success, bytes memory result) = address(this).call(data);
        require(success, "Delegated call failed");

        return result;
    }

    /**
     * @notice Check if address is valid delegate for owner
     */
    function isValidDelegate(address owner, address delegate) external view returns (bool) {
        Delegation memory delegation = delegations[owner];
        return delegation.active 
            && delegation.delegate == delegate 
            && delegation.expiresAt > block.timestamp;
    }

    /**
     * @notice Convert assets to shares
     */
    function convertToShares(uint256 assets) public view returns (uint256) {
        if (totalShares == 0) return assets;
        return (assets * totalShares) / totalAssets;
    }

    /**
     * @notice Convert shares to assets
     */
    function convertToAssets(uint256 shares_) public view returns (uint256) {
        if (totalShares == 0) return 0;
        return (shares_ * totalAssets) / totalShares;
    }

    /**
     * @notice Get user balance in assets
     */
    function balanceOf(address user) external view returns (uint256) {
        return convertToAssets(shares[user]);
    }

    /**
     * @notice Update performance fee (owner only)
     */
    function setPerformanceFee(uint256 newFee) external onlyOwner {
        require(newFee <= 2000, "Fee too high"); // Max 20%
        uint256 oldFee = performanceFee;
        performanceFee = newFee;
        emit PerformanceFeeUpdated(oldFee, newFee);
    }

    /**
     * @notice Pause vault (emergency)
     */
    function pause() external onlyOwner {
        _pause();
    }

    /**
     * @notice Unpause vault
     */
    function unpause() external onlyOwner {
        _unpause();
    }

    /**
     * @notice Get vault info
     */
    function getVaultInfo() external view returns (
        address asset_,
        uint256 totalAssets_,
        uint256 totalShares_,
        uint256 performanceFee_
    ) {
        return (address(asset), totalAssets, totalShares, performanceFee);
    }
}
