// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title AchievementNFT
 * @notice Soulbound NFT badges for achievements
 */
contract AchievementNFT is ERC721, ERC721URIStorage, Ownable {
    uint256 private _tokenIdCounter;
    
    // Achievement metadata
    struct Achievement {
        string name;
        string description;
        uint8 rarity; // 0=common, 1=rare, 2=epic, 3=legendary
        uint256 points;
        bool exists;
    }

    mapping(uint256 => Achievement) public achievements;
    mapping(address => uint256[]) public userAchievements;
    mapping(address => mapping(uint256 => bool)) public hasAchievement;
    mapping(address => uint256) public userPoints;

    // Soulbound - prevent transfers
    bool public soulbound = true;

    event AchievementMinted(address indexed user, uint256 indexed tokenId, uint256 achievementId);
    event AchievementCreated(uint256 indexed achievementId, string name, uint8 rarity);

    constructor() ERC721("DelegateVault Achievement", "DVA") Ownable(msg.sender) {}

    /**
     * @notice Create new achievement type
     */
    function createAchievement(
        uint256 achievementId,
        string memory name,
        string memory description,
        uint8 rarity,
        uint256 points
    ) external onlyOwner {
        require(!achievements[achievementId].exists, "Achievement exists");
        require(rarity <= 3, "Invalid rarity");

        achievements[achievementId] = Achievement({
            name: name,
            description: description,
            rarity: rarity,
            points: points,
            exists: true
        });

        emit AchievementCreated(achievementId, name, rarity);
    }

    /**
     * @notice Mint achievement badge to user
     */
    function mintAchievement(
        address to,
        uint256 achievementId,
        string memory tokenURI
    ) external onlyOwner returns (uint256) {
        require(achievements[achievementId].exists, "Achievement does not exist");
        require(!hasAchievement[to][achievementId], "Already has achievement");

        uint256 tokenId = _tokenIdCounter++;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, tokenURI);

        userAchievements[to].push(achievementId);
        hasAchievement[to][achievementId] = true;
        userPoints[to] += achievements[achievementId].points;

        emit AchievementMinted(to, tokenId, achievementId);

        return tokenId;
    }

    /**
     * @notice Get user's achievements
     */
    function getUserAchievements(address user) external view returns (uint256[] memory) {
        return userAchievements[user];
    }

    /**
     * @notice Get achievement details
     */
    function getAchievement(uint256 achievementId) external view returns (
        string memory name,
        string memory description,
        uint8 rarity,
        uint256 points
    ) {
        Achievement memory achievement = achievements[achievementId];
        require(achievement.exists, "Achievement does not exist");
        
        return (
            achievement.name,
            achievement.description,
            achievement.rarity,
            achievement.points
        );
    }

    /**
     * @notice Override transfer to make soulbound
     */
    function _update(
        address to,
        uint256 tokenId,
        address auth
    ) internal virtual override returns (address) {
        address from = _ownerOf(tokenId);
        
        // Allow minting (from == address(0))
        // Block transfers if soulbound
        if (from != address(0) && soulbound) {
            revert("Soulbound: Transfer not allowed");
        }

        return super._update(to, tokenId, auth);
    }

    /**
     * @notice Toggle soulbound status (owner only)
     */
    function setSoulbound(bool _soulbound) external onlyOwner {
        soulbound = _soulbound;
    }

    // Required overrides
    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
