// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/**
 * @title CircleCompetition
 * @notice Competitive seasons for social investment circles
 * @dev Circle Clash implementation with rankings, prizes, and challenges
 */
contract CircleCompetition is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    // Season structure
    struct Season {
        uint256 id;
        string name;
        uint256 startTime;
        uint256 endTime;
        uint256 prizePool;
        bool active;
        bool finalized;
    }

    // Circle stats
    struct CircleStats {
        uint256 totalTVL;
        uint256 performanceAPY; // in basis points (100 = 1%)
        uint256 memberCount;
        uint256 points;
        uint256 rank;
    }

    // Challenge structure
    struct Challenge {
        uint256 id;
        bytes32 challenger;
        bytes32 challenged;
        uint256 startTime;
        uint256 endTime;
        uint256 stakes;
        bool active;
        bool finalized;
        bytes32 winner;
    }

    // State variables
    uint256 public currentSeasonId;
    mapping(uint256 => Season) public seasons;
    mapping(uint256 => mapping(bytes32 => CircleStats)) public seasonCircleStats;
    mapping(uint256 => bytes32[]) public seasonCircles;
    mapping(uint256 => Challenge) public challenges;
    uint256 public challengeCounter;

    IERC20 public prizeToken;

    // Events
    event SeasonCreated(uint256 indexed seasonId, string name, uint256 prizePool);
    event SeasonFinalized(uint256 indexed seasonId, bytes32[] winners, uint256[] prizes);
    event CircleRegistered(uint256 indexed seasonId, bytes32 indexed circleId);
    event StatsUpdated(uint256 indexed seasonId, bytes32 indexed circleId, uint256 points);
    event ChallengeCreated(uint256 indexed challengeId, bytes32 challenger, bytes32 challenged);
    event ChallengeFinalized(uint256 indexed challengeId, bytes32 winner, uint256 reward);

    constructor(address _prizeToken) Ownable(msg.sender) {
        prizeToken = IERC20(_prizeToken);
    }

    /**
     * @notice Create a new competition season
     */
    function createSeason(
        string memory name,
        uint256 duration,
        uint256 prizePool
    ) external onlyOwner returns (uint256) {
        uint256 seasonId = ++currentSeasonId;
        
        seasons[seasonId] = Season({
            id: seasonId,
            name: name,
            startTime: block.timestamp,
            endTime: block.timestamp + duration,
            prizePool: prizePool,
            active: true,
            finalized: false
        });

        emit SeasonCreated(seasonId, name, prizePool);
        return seasonId;
    }

    /**
     * @notice Register circle for current season
     */
    function registerCircle(bytes32 circleId) external {
        require(seasons[currentSeasonId].active, "No active season");
        require(
            seasonCircleStats[currentSeasonId][circleId].points == 0,
            "Already registered"
        );

        seasonCircles[currentSeasonId].push(circleId);
        
        emit CircleRegistered(currentSeasonId, circleId);
    }

    /**
     * @notice Update circle statistics
     */
    function updateCircleStats(
        uint256 seasonId,
        bytes32 circleId,
        uint256 tvl,
        uint256 apy,
        uint256 members
    ) external onlyOwner {
        require(seasons[seasonId].active, "Season not active");

        // Calculate points
        uint256 points = calculatePoints(tvl, apy, members);

        seasonCircleStats[seasonId][circleId] = CircleStats({
            totalTVL: tvl,
            performanceAPY: apy,
            memberCount: members,
            points: points,
            rank: 0 // Will be calculated when finalizing
        });

        emit StatsUpdated(seasonId, circleId, points);
    }

    /**
     * @notice Calculate circle points
     */
    function calculatePoints(
        uint256 tvl,
        uint256 apy,
        uint256 members
    ) public pure returns (uint256) {
        // Points formula: (APY * 10) + (TVL/1000 * 5) + (Members * 20)
        uint256 apyPoints = (apy * 10) / 100; // APY in basis points
        uint256 tvlPoints = (tvl / 1000 ether) * 5;
        uint256 memberPoints = members * 20;

        return apyPoints + tvlPoints + memberPoints;
    }

    /**
     * @notice Create a challenge between two circles
     */
    function createChallenge(
        bytes32 challenger,
        bytes32 challenged,
        uint256 duration,
        uint256 stakes
    ) external nonReentrant returns (uint256) {
        require(seasons[currentSeasonId].active, "No active season");
        require(stakes > 0, "Stakes must be > 0");

        uint256 challengeId = ++challengeCounter;

        challenges[challengeId] = Challenge({
            id: challengeId,
            challenger: challenger,
            challenged: challenged,
            startTime: block.timestamp,
            endTime: block.timestamp + duration,
            stakes: stakes,
            active: true,
            finalized: false,
            winner: bytes32(0)
        });

        // Transfer stakes
        prizeToken.safeTransferFrom(msg.sender, address(this), stakes);

        emit ChallengeCreated(challengeId, challenger, challenged);
        return challengeId;
    }

    /**
     * @notice Finalize a challenge
     */
    function finalizeChallenge(uint256 challengeId) external onlyOwner {
        Challenge storage challenge = challenges[challengeId];
        
        require(challenge.active, "Challenge not active");
        require(block.timestamp >= challenge.endTime, "Challenge not ended");
        require(!challenge.finalized, "Already finalized");

        // Determine winner based on points
        CircleStats memory challengerStats = seasonCircleStats[currentSeasonId][challenge.challenger];
        CircleStats memory challengedStats = seasonCircleStats[currentSeasonId][challenge.challenged];

        bytes32 winner = challengerStats.points > challengedStats.points
            ? challenge.challenger
            : challenge.challenged;

        challenge.winner = winner;
        challenge.finalized = true;
        challenge.active = false;

        // Award stakes to winner (in production, send to circle treasury)
        // For now, keep in contract
        
        emit ChallengeFinalized(challengeId, winner, challenge.stakes);
    }

    /**
     * @notice Finalize season and distribute prizes
     */
    function finalizeSeason(uint256 seasonId) external onlyOwner {
        Season storage season = seasons[seasonId];
        
        require(season.active, "Season not active");
        require(block.timestamp >= season.endTime, "Season not ended");
        require(!season.finalized, "Already finalized");

        // Calculate rankings
        bytes32[] memory circles = seasonCircles[seasonId];
        uint256[] memory points = new uint256[](circles.length);

        for (uint256 i = 0; i < circles.length; i++) {
            points[i] = seasonCircleStats[seasonId][circles[i]].points;
        }

        // Sort and assign ranks (simple bubble sort for demo)
        for (uint256 i = 0; i < circles.length; i++) {
            for (uint256 j = i + 1; j < circles.length; j++) {
                if (points[j] > points[i]) {
                    // Swap
                    (points[i], points[j]) = (points[j], points[i]);
                    (circles[i], circles[j]) = (circles[j], circles[i]);
                }
            }
        }

        // Assign ranks
        for (uint256 i = 0; i < circles.length; i++) {
            seasonCircleStats[seasonId][circles[i]].rank = i + 1;
        }

        // Calculate prize distribution
        uint256[] memory prizes = calculatePrizeDistribution(season.prizePool);
        
        season.finalized = true;
        season.active = false;

        emit SeasonFinalized(seasonId, circles, prizes);
    }

    /**
     * @notice Calculate prize distribution
     */
    function calculatePrizeDistribution(uint256 totalPrize) 
        public 
        pure 
        returns (uint256[] memory) 
    {
        uint256[] memory prizes = new uint256[](4);
        prizes[0] = (totalPrize * 50) / 100; // 50%
        prizes[1] = (totalPrize * 30) / 100; // 30%
        prizes[2] = (totalPrize * 15) / 100; // 15%
        prizes[3] = (totalPrize * 5) / 100;  // 5%
        return prizes;
    }

    /**
     * @notice Get circle ranking
     */
    function getCircleRank(uint256 seasonId, bytes32 circleId) 
        external 
        view 
        returns (uint256) 
    {
        return seasonCircleStats[seasonId][circleId].rank;
    }

    /**
     * @notice Get top circles
     */
    function getTopCircles(uint256 seasonId, uint256 limit) 
        external 
        view 
        returns (bytes32[] memory, uint256[] memory) 
    {
        bytes32[] memory circles = seasonCircles[seasonId];
        uint256 count = circles.length < limit ? circles.length : limit;
        
        bytes32[] memory topCircles = new bytes32[](count);
        uint256[] memory topPoints = new uint256[](count);

        for (uint256 i = 0; i < count; i++) {
            topCircles[i] = circles[i];
            topPoints[i] = seasonCircleStats[seasonId][circles[i]].points;
        }

        return (topCircles, topPoints);
    }

    /**
     * @notice Withdraw prize pool (owner only)
     */
    function withdrawPrizes(address to, uint256 amount) external onlyOwner {
        prizeToken.safeTransfer(to, amount);
    }

    /**
     * @notice Get season info
     */
    function getSeasonInfo(uint256 seasonId) 
        external 
        view 
        returns (Season memory) 
    {
        return seasons[seasonId];
    }

    /**
     * @notice Get challenge info
     */
    function getChallengeInfo(uint256 challengeId) 
        external 
        view 
        returns (Challenge memory) 
    {
        return challenges[challengeId];
    }
}
