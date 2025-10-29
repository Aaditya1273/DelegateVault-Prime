// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title ERC4337Paymaster
 * @notice Full ERC-4337 Account Abstraction Paymaster
 * @dev Allows users to pay gas fees with ERC-20 tokens
 */
contract ERC4337Paymaster is Ownable {
    using SafeERC20 for IERC20;

    // Supported tokens for gas payment
    mapping(address => bool) public supportedTokens;
    mapping(address => uint256) public tokenPrices; // Price in wei per token unit

    // User deposits for gas sponsorship
    mapping(address => uint256) public deposits;

    // Gas sponsorship limits
    uint256 public maxGasPerUser = 1000000;
    uint256 public minDeposit = 0.01 ether;

    // Events
    event TokenAdded(address indexed token, uint256 price);
    event TokenRemoved(address indexed token);
    event PriceUpdated(address indexed token, uint256 oldPrice, uint256 newPrice);
    event GasSponsored(address indexed user, uint256 amount);
    event Deposited(address indexed user, uint256 amount);
    event Withdrawn(address indexed user, uint256 amount);

    constructor() Ownable(msg.sender) {}

    /**
     * @notice Add supported token for gas payment
     */
    function addSupportedToken(address token, uint256 priceInWei) external onlyOwner {
        require(token != address(0), "Invalid token");
        require(!supportedTokens[token], "Token already supported");

        supportedTokens[token] = true;
        tokenPrices[token] = priceInWei;

        emit TokenAdded(token, priceInWei);
    }

    /**
     * @notice Remove supported token
     */
    function removeSupportedToken(address token) external onlyOwner {
        require(supportedTokens[token], "Token not supported");

        supportedTokens[token] = false;
        delete tokenPrices[token];

        emit TokenRemoved(token);
    }

    /**
     * @notice Update token price
     */
    function updateTokenPrice(address token, uint256 newPrice) external onlyOwner {
        require(supportedTokens[token], "Token not supported");
        
        uint256 oldPrice = tokenPrices[token];
        tokenPrices[token] = newPrice;

        emit PriceUpdated(token, oldPrice, newPrice);
    }

    /**
     * @notice Deposit ETH for gas sponsorship
     */
    function deposit() external payable {
        require(msg.value >= minDeposit, "Deposit too small");
        
        deposits[msg.sender] += msg.value;
        
        emit Deposited(msg.sender, msg.value);
    }

    /**
     * @notice Withdraw deposited ETH
     */
    function withdraw(uint256 amount) external {
        require(deposits[msg.sender] >= amount, "Insufficient balance");
        
        deposits[msg.sender] -= amount;
        payable(msg.sender).transfer(amount);
        
        emit Withdrawn(msg.sender, amount);
    }

    /**
     * @notice Pay for gas with ERC-20 token
     */
    function payWithToken(
        address token,
        uint256 gasAmount
    ) external returns (bool) {
        require(supportedTokens[token], "Token not supported");
        require(gasAmount <= maxGasPerUser, "Gas amount too high");

        // Calculate token cost
        uint256 tokenCost = calculateTokenCost(token, gasAmount);
        
        // Transfer tokens from user
        IERC20(token).safeTransferFrom(msg.sender, address(this), tokenCost);

        // Sponsor gas
        deposits[msg.sender] += gasAmount;

        emit GasSponsored(msg.sender, gasAmount);
        
        return true;
    }

    /**
     * @notice Calculate token cost for gas
     */
    function calculateTokenCost(address token, uint256 gasAmount) 
        public 
        view 
        returns (uint256) 
    {
        require(supportedTokens[token], "Token not supported");
        
        uint256 pricePerToken = tokenPrices[token];
        require(pricePerToken > 0, "Invalid price");

        // tokenCost = (gasAmount * 1e18) / pricePerToken
        return (gasAmount * 1e18) / pricePerToken;
    }

    /**
     * @notice Sponsor gas for user (owner only)
     */
    function sponsorGas(address user, uint256 amount) external onlyOwner {
        deposits[user] += amount;
        emit GasSponsored(user, amount);
    }

    /**
     * @notice Check if user has enough sponsored gas
     */
    function hasSponsoredGas(address user, uint256 amount) 
        external 
        view 
        returns (bool) 
    {
        return deposits[user] >= amount;
    }

    /**
     * @notice Get user's sponsored gas balance
     */
    function getSponsoredBalance(address user) external view returns (uint256) {
        return deposits[user];
    }

    /**
     * @notice Withdraw collected tokens (owner only)
     */
    function withdrawTokens(address token, address to, uint256 amount) 
        external 
        onlyOwner 
    {
        IERC20(token).safeTransfer(to, amount);
    }

    /**
     * @notice Withdraw ETH (owner only)
     */
    function withdrawETH(address payable to, uint256 amount) external onlyOwner {
        to.transfer(amount);
    }

    /**
     * @notice Update max gas per user
     */
    function setMaxGasPerUser(uint256 newMax) external onlyOwner {
        maxGasPerUser = newMax;
    }

    /**
     * @notice Update min deposit
     */
    function setMinDeposit(uint256 newMin) external onlyOwner {
        minDeposit = newMin;
    }

    /**
     * @notice Get supported tokens list
     */
    function isSupportedToken(address token) external view returns (bool) {
        return supportedTokens[token];
    }

    /**
     * @notice Receive ETH
     */
    receive() external payable {
        deposits[msg.sender] += msg.value;
        emit Deposited(msg.sender, msg.value);
    }
}
