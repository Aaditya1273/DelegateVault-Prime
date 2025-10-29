// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title TokenPaymaster
 * @notice Simplified paymaster for gasless transactions (hackathon version)
 * @dev In production, use full ERC-4337 BasePaymaster
 */
contract TokenPaymaster is Ownable {
    IERC20 public token;
    uint256 public tokenPrice; // Token price in wei per token unit
    
    mapping(address => uint256) public sponsoredGas;
    
    event GasSponsored(address indexed user, uint256 amount);
    event TokenPriceUpdated(uint256 oldPrice, uint256 newPrice);
    
    constructor(IERC20 _token) Ownable(msg.sender) {
        token = _token;
        tokenPrice = 1e15; // 0.001 ETH per token (default)
    }
    
    /**
     * @notice Sponsor gas for user
     */
    function sponsorGas(address user, uint256 gasAmount) external onlyOwner {
        sponsoredGas[user] += gasAmount;
        emit GasSponsored(user, gasAmount);
    }
    
    /**
     * @notice Pay for gas with tokens
     */
    function payWithTokens(uint256 gasCost) external {
        uint256 tokenCost = (gasCost * 1e18) / tokenPrice;
        
        require(token.balanceOf(msg.sender) >= tokenCost, "Insufficient tokens");
        require(
            token.transferFrom(msg.sender, address(this), tokenCost),
            "Token transfer failed"
        );
        
        // In production, this would refund ETH to the user
        // For hackathon, we just track it
        sponsoredGas[msg.sender] += gasCost;
    }
    
    /**
     * @notice Check if user has sponsored gas
     */
    function hasSponsored Gas(address user, uint256 amount) external view returns (bool) {
        return sponsoredGas[user] >= amount;
    }
    
    /**
     * @notice Update token price
     */
    function setTokenPrice(uint256 newPrice) external onlyOwner {
        uint256 oldPrice = tokenPrice;
        tokenPrice = newPrice;
        emit TokenPriceUpdated(oldPrice, newPrice);
    }
    
    /**
     * @notice Withdraw tokens
     */
    function withdrawTokens(address to, uint256 amount) external onlyOwner {
        token.transfer(to, amount);
    }
    
    /**
     * @notice Withdraw ETH
     */
    function withdrawETH(address payable to, uint256 amount) external onlyOwner {
        to.transfer(amount);
    }
    
    receive() external payable {}
}
