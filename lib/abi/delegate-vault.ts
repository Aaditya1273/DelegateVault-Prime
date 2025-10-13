export const DELEGATE_VAULT_ABI = [
  { type: "constructor", inputs: [{ name: "underlying_", type: "address" }], stateMutability: "nonpayable" },
  { type: "function", name: "owner", inputs: [], outputs: [{ type: "address" }], stateMutability: "view" },
  { type: "function", name: "underlying", inputs: [], outputs: [{ type: "address" }], stateMutability: "view" },
  { type: "function", name: "paused", inputs: [], outputs: [{ type: "bool" }], stateMutability: "view" },
  { type: "function", name: "feeBps", inputs: [], outputs: [{ type: "uint16" }], stateMutability: "view" },
  { type: "function", name: "totalShares", inputs: [], outputs: [{ type: "uint256" }], stateMutability: "view" },
  {
    type: "function",
    name: "balanceOf",
    inputs: [{ name: "account", type: "address" }],
    outputs: [{ type: "uint256" }],
    stateMutability: "view",
  },
  { type: "function", name: "totalAssets", inputs: [], outputs: [{ type: "uint256" }], stateMutability: "view" },

  {
    type: "function",
    name: "transferOwnership",
    inputs: [{ name: "newOwner", type: "address" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "setFeeBps",
    inputs: [{ name: "newFeeBps", type: "uint16" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  { type: "function", name: "pause", inputs: [], outputs: [], stateMutability: "nonpayable" },
  { type: "function", name: "unpause", inputs: [], outputs: [], stateMutability: "nonpayable" },

  { type: "function", name: "depositETH", inputs: [], outputs: [], stateMutability: "payable" },
  {
    type: "function",
    name: "depositToken",
    inputs: [{ name: "amount", type: "uint256" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "withdraw",
    inputs: [{ name: "shares", type: "uint256" }],
    outputs: [],
    stateMutability: "nonpayable",
  },

  {
    type: "function",
    name: "sweep",
    inputs: [
      { name: "token", type: "address" },
      { name: "to", type: "address" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },

  {
    type: "event",
    name: "Deposited",
    inputs: [
      { name: "user", type: "address", indexed: true },
      { name: "assets", type: "uint256", indexed: false },
      { name: "shares", type: "uint256", indexed: false },
    ],
  },
  {
    type: "event",
    name: "Withdrawn",
    inputs: [
      { name: "user", type: "address", indexed: true },
      { name: "assets", type: "uint256", indexed: false },
      { name: "shares", type: "uint256", indexed: false },
    ],
  },
  { type: "event", name: "Paused", inputs: [{ name: "by", type: "address", indexed: true }] },
  { type: "event", name: "Unpaused", inputs: [{ name: "by", type: "address", indexed: true }] },
  {
    type: "event",
    name: "FeeChanged",
    inputs: [
      { name: "oldFee", type: "uint16", indexed: false },
      { name: "newFee", type: "uint16", indexed: false },
    ],
  },
  {
    type: "event",
    name: "OwnershipTransferred",
    inputs: [
      { name: "previousOwner", type: "address", indexed: true },
      { name: "newOwner", type: "address", indexed: true },
    ],
  },
] as const
