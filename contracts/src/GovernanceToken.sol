// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title GovernanceToken
 * @notice DVP governance token with voting capabilities
 */
contract GovernanceToken is ERC20, ERC20Votes, Ownable {
    uint256 public constant MAX_SUPPLY = 1_000_000_000 * 10**18; // 1 billion tokens

    constructor() 
        ERC20("DelegateVault Prime", "DVP") 
        ERC20Permit("DelegateVault Prime")
        Ownable(msg.sender)
    {
        // Mint initial supply to owner
        _mint(msg.sender, 100_000_000 * 10**18); // 100M initial
    }

    /**
     * @notice Mint new tokens (owner only)
     */
    function mint(address to, uint256 amount) external onlyOwner {
        require(totalSupply() + amount <= MAX_SUPPLY, "Exceeds max supply");
        _mint(to, amount);
    }

    /**
     * @notice Burn tokens
     */
    function burn(uint256 amount) external {
        _burn(msg.sender, amount);
    }

    // Required overrides
    function _update(address from, address to, uint256 amount)
        internal
        override(ERC20, ERC20Votes)
    {
        super._update(from, to, amount);
    }

    function nonces(address owner)
        public
        view
        override(ERC20Permit, Nonces)
        returns (uint256)
    {
        return super.nonces(owner);
    }
}
