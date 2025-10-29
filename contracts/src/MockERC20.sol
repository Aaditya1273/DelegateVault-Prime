// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/**
 * @title MockERC20
 * @notice Mock token for testing
 */
contract MockERC20 is ERC20 {
    constructor(
        string memory name,
        string memory symbol
    ) ERC20(name, symbol) {
        // Mint 1M tokens to deployer
        _mint(msg.sender, 1_000_000 * 10**18);
    }

    /**
     * @notice Mint tokens (anyone can mint for testing)
     */
    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }

    /**
     * @notice Faucet - get 1000 tokens
     */
    function faucet() external {
        _mint(msg.sender, 1000 * 10**18);
    }
}
