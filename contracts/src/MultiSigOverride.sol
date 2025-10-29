// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title MultiSigOverride
 * @notice Multi-signature governance for vault overrides
 */
contract MultiSigOverride {
    struct Proposal {
        uint256 id;
        address vault;
        address target;
        bytes data;
        uint256 value;
        uint256 approvals;
        uint256 threshold;
        bool executed;
        uint256 createdAt;
    }
    
    mapping(uint256 => Proposal) public proposals;
    mapping(uint256 => mapping(address => bool)) public hasApproved;
    mapping(address => address[]) public vaultSigners;
    mapping(address => uint256) public vaultThreshold;
    
    uint256 public proposalCount;
    uint256 public constant PROPOSAL_LIFETIME = 7 days;
    
    event SignersUpdated(address indexed vault, address[] signers, uint256 threshold);
    event ProposalCreated(uint256 indexed id, address indexed vault, address target);
    event ProposalApproved(uint256 indexed id, address indexed signer);
    event ProposalExecuted(uint256 indexed id);
    event ProposalCancelled(uint256 indexed id);
    
    /**
     * @notice Set signers for a vault
     */
    function setSigners(
        address vault,
        address[] memory signers,
        uint256 threshold
    ) external {
        require(signers.length >= threshold, "Invalid threshold");
        require(threshold > 0, "Threshold must be > 0");
        
        vaultSigners[vault] = signers;
        vaultThreshold[vault] = threshold;
        
        emit SignersUpdated(vault, signers, threshold);
    }
    
    /**
     * @notice Create a proposal
     */
    function createProposal(
        address vault,
        address target,
        bytes memory data,
        uint256 value
    ) external returns (uint256) {
        require(isSignerForVault(vault, msg.sender), "Not a signer");
        
        uint256 id = ++proposalCount;
        
        proposals[id] = Proposal({
            id: id,
            vault: vault,
            target: target,
            data: data,
            value: value,
            approvals: 0,
            threshold: vaultThreshold[vault],
            executed: false,
            createdAt: block.timestamp
        });
        
        emit ProposalCreated(id, vault, target);
        return id;
    }
    
    /**
     * @notice Approve a proposal
     */
    function approveProposal(uint256 proposalId) external {
        Proposal storage prop = proposals[proposalId];
        
        require(prop.id != 0, "Proposal does not exist");
        require(!prop.executed, "Already executed");
        require(isSignerForVault(prop.vault, msg.sender), "Not a signer");
        require(!hasApproved[proposalId][msg.sender], "Already approved");
        require(block.timestamp <= prop.createdAt + PROPOSAL_LIFETIME, "Proposal expired");
        
        hasApproved[proposalId][msg.sender] = true;
        prop.approvals++;
        
        emit ProposalApproved(proposalId, msg.sender);
        
        // Auto-execute if threshold reached
        if (prop.approvals >= prop.threshold) {
            _executeProposal(proposalId);
        }
    }
    
    /**
     * @notice Execute a proposal (internal)
     */
    function _executeProposal(uint256 proposalId) internal {
        Proposal storage prop = proposals[proposalId];
        
        require(!prop.executed, "Already executed");
        require(prop.approvals >= prop.threshold, "Not enough approvals");
        
        prop.executed = true;
        
        (bool success, ) = prop.target.call{value: prop.value}(prop.data);
        require(success, "Execution failed");
        
        emit ProposalExecuted(proposalId);
    }
    
    /**
     * @notice Cancel a proposal
     */
    function cancelProposal(uint256 proposalId) external {
        Proposal storage prop = proposals[proposalId];
        
        require(prop.id != 0, "Proposal does not exist");
        require(!prop.executed, "Already executed");
        require(isSignerForVault(prop.vault, msg.sender), "Not a signer");
        
        // Mark as executed to prevent further approvals
        prop.executed = true;
        
        emit ProposalCancelled(proposalId);
    }
    
    /**
     * @notice Check if address is signer for vault
     */
    function isSignerForVault(address vault, address signer) public view returns (bool) {
        address[] memory signers = vaultSigners[vault];
        for (uint256 i = 0; i < signers.length; i++) {
            if (signers[i] == signer) return true;
        }
        return false;
    }
    
    /**
     * @notice Get vault signers
     */
    function getVaultSigners(address vault) external view returns (address[] memory) {
        return vaultSigners[vault];
    }
    
    /**
     * @notice Get proposal details
     */
    function getProposal(uint256 proposalId) external view returns (
        address vault,
        address target,
        uint256 approvals,
        uint256 threshold,
        bool executed,
        uint256 createdAt
    ) {
        Proposal memory prop = proposals[proposalId];
        return (
            prop.vault,
            prop.target,
            prop.approvals,
            prop.threshold,
            prop.executed,
            prop.createdAt
        );
    }
    
    /**
     * @notice Check if proposal is expired
     */
    function isProposalExpired(uint256 proposalId) external view returns (bool) {
        Proposal memory prop = proposals[proposalId];
        return block.timestamp > prop.createdAt + PROPOSAL_LIFETIME;
    }
}
