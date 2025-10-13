// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

// Minimal interfaces and guards to avoid external deps.
// NOTE: In production, prefer OpenZeppelin libraries and rigorous audits.

interface IERC20 {
  function totalSupply() external view returns (uint256);
  function balanceOf(address account) external view returns (uint256);
  function transfer(address to, uint256 amount) external returns (bool);
  function allowance(address owner, address spender) external view returns (uint256);
  function approve(address spender, uint256 amount) external returns (bool);
  function transferFrom(address from, address to, uint256 value) external returns (bool);
}

error NotOwner();
error Paused();
error ZeroAddress();
error InvalidAmount();
error InsufficientShares();
error InvalidFee();

contract DelegateVault {
  address public immutable underlying; // address(0) => ETH
  address public owner;
  bool public paused;
  uint16 public feeBps; // 0..1000 (up to 10%)
  uint256 public totalShares;
  mapping(address => uint256) public balanceOf;

  uint256 private _entered;

  event Deposited(address indexed user, uint256 assets, uint256 shares);
  event Withdrawn(address indexed user, uint256 assets, uint256 shares);
  event Paused(address indexed by);
  event Unpaused(address indexed by);
  event FeeChanged(uint16 oldFee, uint16 newFee);
  event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

  modifier onlyOwner() {
    if (msg.sender != owner) revert NotOwner();
    _;
  }
  modifier whenNotPaused() {
    if (paused) revert Paused();
    _;
  }
  modifier nonReentrant() {
    require(_entered == 0, "REENTRANCY");
    _entered = 1;
    _;
    _entered = 0;
  }

  constructor(address underlying_) {
    owner = msg.sender;
    underlying = underlying_;
    if (feeBps > 1000) revert InvalidFee();
    emit OwnershipTransferred(address(0), msg.sender);
  }

  function transferOwnership(address newOwner) external onlyOwner {
    if (newOwner == address(0)) revert ZeroAddress();
    emit OwnershipTransferred(owner, newOwner);
    owner = newOwner;
  }

  function setFeeBps(uint16 newFeeBps) external onlyOwner {
    if (newFeeBps > 1000) revert InvalidFee();
    uint16 old = feeBps;
    feeBps = newFeeBps;
    emit FeeChanged(old, newFeeBps);
  }

  function pause() external onlyOwner {
    paused = true;
    emit Paused(msg.sender);
  }

  function unpause() external onlyOwner {
    paused = false;
    emit Unpaused(msg.sender);
  }

  function totalAssets() public view returns (uint256) {
    if (underlying == address(0)) {
      return address(this).balance;
    } else {
      return IERC20(underlying).balanceOf(address(this));
    }
  }

  function depositETH() external payable whenNotPaused nonReentrant {
    if (underlying != address(0)) revert InvalidAmount(); // vault is ERC20-mode
    uint256 assets = msg.value;
    if (assets == 0) revert InvalidAmount();

    uint256 shares = _previewShares(assets);
    totalShares += shares;
    balanceOf[msg.sender] += shares;

    emit Deposited(msg.sender, assets, shares);
  }

  function depositToken(uint256 amount) external whenNotPaused nonReentrant {
    if (underlying == address(0)) revert InvalidAmount(); // vault is ETH-mode
    if (amount == 0) revert InvalidAmount();

    // pull funds
    bool ok = IERC20(underlying).transferFrom(msg.sender, address(this), amount);
    require(ok, "TRANSFER_FROM_FAILED");

    uint256 shares = _previewShares(amount);
    totalShares += shares;
    balanceOf[msg.sender] += shares;

    emit Deposited(msg.sender, amount, shares);
  }

  function withdraw(uint256 shares) external whenNotPaused nonReentrant {
    if (shares == 0) revert InvalidAmount();
    uint256 userShares = balanceOf[msg.sender];
    if (shares > userShares) revert InsufficientShares();

    uint256 assets = _previewAssets(shares);

    balanceOf[msg.sender] = userShares - shares;
    totalShares -= shares;

    // fee (if any)
    uint256 fee = (assets * feeBps) / 10_000;
    uint256 payout = assets - fee;

    if (underlying == address(0)) {
      // send ETH
      if (payout > 0) {
        (bool s1, ) = msg.sender.call{value: payout}("");
        require(s1, "ETH_TRANSFER_FAILED");
      }
      if (fee > 0) {
        (bool s2, ) = payable(owner).call{value: fee}("");
        require(s2, "FEE_TRANSFER_FAILED");
      }
    } else {
      if (payout > 0) {
        bool ok1 = IERC20(underlying).transfer(msg.sender, payout);
        require(ok1, "TRANSFER_FAILED");
      }
      if (fee > 0) {
        bool ok2 = IERC20(underlying).transfer(owner, fee);
        require(ok2, "FEE_TRANSFER_FAILED");
      }
    }

    emit Withdrawn(msg.sender, assets, shares);
  }

  function sweep(address token, address to) external onlyOwner nonReentrant {
    if (to == address(0)) revert ZeroAddress();
    if (token == address(0)) {
      uint256 amt = address(this).balance - _reservedETH();
      (bool s, ) = to.call{value: amt}("");
      require(s, "SWEEP_ETH_FAILED");
    } else {
      uint256 bal = IERC20(token).balanceOf(address(this));
      bool ok = IERC20(token).transfer(to, bal);
      require(ok, "SWEEP_TOKEN_FAILED");
    }
  }

  function _previewShares(uint256 assets) internal view returns (uint256) {
    // Simple 1:1 shares for MVP; replace with price-per-share logic for strategies.
    if (totalShares == 0 || totalAssets() == 0) return assets;
    // keep invariant share:asset ratio
    return (assets * totalShares) / totalAssets();
  }

  function _previewAssets(uint256 shares) internal view returns (uint256) {
    if (totalShares == 0) return 0;
    return (shares * totalAssets()) / totalShares;
  }

  function _reservedETH() internal pure returns (uint256) {
    // placeholder in case you add liabilities; currently 0 for MVP.
    return 0;
  }

  receive() external payable {
    // allow receiving ETH (e.g., direct sends); not counted as deposits.
  }
}
